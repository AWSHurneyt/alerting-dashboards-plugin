/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { get, isEqual } from 'lodash';
import { EuiHorizontalRule } from '@elastic/eui';
import moment from 'moment';

import ContentPanel from '../../../../components/ContentPanel';
import {
  TriggersTimeSeries,
  POIChart,
  Legend,
  EmptyHistory,
} from '../../components/MonitorHistory/';
import { calculateInterval } from './utils/timeUtils';
import DateRangePicker from './DateRangePicker';

import {
  generateFirstDataPoints,
  dataPointsGenerator,
  getPOISearchQuery,
  parseGroupedData,
} from './utils/chartHelpers';
import * as HistoryConstants from './utils/constants';
import { INDEX } from '../../../../../utils/constants';
import { backendErrorNotification } from '../../../../utils/helpers';
import { MONITOR_TYPE } from '../../../../utils/constants';
import { getDataSourceQueryObj, getDataSourceId } from '../../../utils/helpers';

const MonitorHistory = ({
  triggers,
  onShowTrigger,
  isDarkMode,
  notifications,
  monitorType,
  httpClient,
  monitorId,
}) => {
  const initialStartTime = useRef(
    moment(Date.now())
      .subtract(HistoryConstants.DEFAULT_POI_TIME_WINDOW_DAYS, 'days')
      .startOf('day')
  );
  const initialEndTime = useRef(moment(Date.now()));
  const dataSourceQuery = useRef(getDataSourceQueryObj());

  const [poiData, setPoiData] = useState([]);
  const [triggersData, setTriggersData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [maxAlerts, setMaxAlerts] = useState(0);
  const [timeSeriesWindow, setTimeSeriesWindow] = useState({});
  const [prevTimeSeriesWindow, setPrevTimeSeriesWindow] = useState(null);
  const [poiTimeWindow, setPoiTimeWindow] = useState({
    startTime: initialStartTime.current,
    endTime: initialEndTime.current,
  });

  const generatePlotData = useCallback(
    (alertsData, windowStartTime, windowEndTime) => {
      if (alertsData.length === 0) {
        return [
          {
            x0: windowStartTime,
            x: windowEndTime,
            state: HistoryConstants.TIME_SERIES_ALERT_STATE.NO_ALERTS,
            meta: { startTime: windowStartTime, endTime: windowEndTime },
          },
        ];
      }

      const [firstAlert, ...restAlerts] = alertsData;
      const firstAlertDataPoints = generateFirstDataPoints({
        startTime: get(firstAlert, '_source.start_time'),
        acknowledgedTime: get(firstAlert, '_source.acknowledged_time'),
        endTime: get(firstAlert, '_source.end_time'),
        state: get(firstAlert, '_source.state'),
        windowStartTime,
        windowEndTime,
        errorsCount: get(firstAlert, '_source.alert_history.length', 0),
      });

      let lastEndTime = get(firstAlert, '_source.end_time');
      const restAlertsDataPoints = restAlerts.reduce((acc, currentAlert) => {
        const {
          start_time: startTime,
          acknowledged_time: acknowledgedTime,
          end_time: currentEndTime,
          state,
          alert_history = [],
        } = currentAlert._source;
        acc.push(
          ...dataPointsGenerator(
            {
              startTime,
              acknowledgedTime,
              endTime: currentEndTime,
              lastEndTime,
              windowStartTime,
              windowEndTime,
              meta: {
                startTime,
                acknowledgedTime,
                endTime: currentEndTime,
                state,
                errorsCount: alert_history.length,
              },
            },
            lastEndTime
          )
        );
        lastEndTime = currentEndTime;
        return acc;
      }, []);

      const lastAlertDataPoint = [];
      if (lastEndTime && lastEndTime < windowEndTime) {
        lastAlertDataPoint.push({
          x0: lastEndTime,
          x: windowEndTime,
          state: HistoryConstants.TIME_SERIES_ALERT_STATE.NO_ALERTS,
          meta: { startTime: lastEndTime, endTime: windowEndTime },
        });
      }

      const triggerData = [...firstAlertDataPoints, ...restAlertsDataPoints, ...lastAlertDataPoint];
      return monitorType === MONITOR_TYPE.BUCKET_LEVEL
        ? parseGroupedData(triggerData)
        : triggerData;
    },
    [monitorType]
  );

  const getWindowSize = useCallback((intervalDuration, endTime) => {
    const brushAreaStartDuration =
      intervalDuration.asMinutes() < 10
        ? moment.duration(HistoryConstants.MIN_HIGHLIGHT_WINDOW_DURATION, 'm')
        : intervalDuration;
    return {
      startTime: endTime.valueOf() - brushAreaStartDuration.asMilliseconds(),
      endTime: endTime.valueOf(),
    };
  }, []);

  const getAlerts = useCallback(
    async (window) => {
      setIsLoading(true);
      try {
        const params = {
          size: HistoryConstants.MAX_DOC_COUNT_FOR_ALERTS,
          sortField: 'start_time',
          sortDirection: 'asc',
          monitorIds: monitorId,
          monitorType,
          dataSourceId: getDataSourceId(),
        };
        const resp = await httpClient.get('../api/alerting/alerts', { query: params });
        let alerts = [];
        if (resp.ok) {
          alerts = resp.alerts;
        } else {
          backendErrorNotification(notifications, 'get', 'alerts', resp.err);
        }

        const triggerTemp = {};
        alerts.forEach((alert) => {
          if (
            alert.start_time <= window.endTime &&
            (alert.end_time == null || alert.end_time >= window.startTime)
          ) {
            if (!(alert.trigger_id in triggerTemp)) triggerTemp[alert.trigger_id] = [];
            triggerTemp[alert.trigger_id].push({ _source: alert });
          }
        });

        const newTriggersData = {};
        triggers.forEach((trigger) => {
          newTriggersData[trigger.id] = generatePlotData(
            get(triggerTemp, trigger.id, []),
            window.startTime,
            window.endTime
          );
        });

        setTriggersData(newTriggersData);
        setIsLoading(false);
        setPrevTimeSeriesWindow(window);
      } catch (err) {
        console.log('err', err);
      }
    },
    [httpClient, monitorId, monitorType, triggers, notifications, generatePlotData]
  );

  const getPOIData = useCallback(async () => {
    const intervalDuration = calculateInterval(
      moment.duration(poiTimeWindow.endTime - poiTimeWindow.startTime, 'ms')
    );

    try {
      const requestBody = {
        query: getPOISearchQuery(
          monitorId,
          poiTimeWindow.startTime.valueOf(),
          poiTimeWindow.endTime.valueOf(),
          intervalDuration
        ),
        index: INDEX.ALL_ALERTS,
      };

      const resp = await httpClient.post('../api/alerting/monitors/_search', {
        body: JSON.stringify(requestBody),
        query: dataSourceQuery.current?.query,
      });

      if (resp.ok) {
        const newPoiData = get(resp, 'resp.aggregations.alerts_over_time.buckets', []).map(
          (item) => ({ x: item.key, y: item.doc_count })
        );
        const newMaxAlerts = get(resp, 'resp.aggregations.max_alerts.value', 0);
        const newWindow = getWindowSize(intervalDuration, poiTimeWindow.endTime);
        setPoiData(newPoiData);
        setMaxAlerts(newMaxAlerts);
        setTimeSeriesWindow(newWindow);
        getAlerts(newWindow);
      }
    } catch (err) {
      console.log('err', err);
    }
  }, [httpClient, monitorId, poiTimeWindow, getWindowSize, getAlerts]);

  useEffect(() => {
    if (triggers.length > 0) {
      getPOIData();
    }
  }, [triggers, poiTimeWindow]);

  const handleRangeChange = useCallback((startTime, endTime) => {
    setPoiTimeWindow({ startTime, endTime });
  }, []);

  const handleDragEnd = useCallback(
    (area) => {
      if ((area && area.left.getTime() === timeSeriesWindow.startTime) || isLoading) return;
      const newWindow = { startTime: area.left.getTime(), endTime: area.right.getTime() };
      setPrevTimeSeriesWindow(timeSeriesWindow);
      setTimeSeriesWindow(newWindow);
      getAlerts(newWindow);
    },
    [timeSeriesWindow, isLoading, getAlerts]
  );

  const isBucketMonitor = monitorType === MONITOR_TYPE.BUCKET_LEVEL;

  return (
    <ContentPanel
      title="History"
      titleSize="s"
      bodyStyles={{ minHeight: 200, padding: 0 }}
      actions={[
        <DateRangePicker
          initialStartTime={initialStartTime.current}
          initialEndTime={initialEndTime.current}
          onRangeChange={handleRangeChange}
          compressed
        />,
      ]}
    >
      {triggers.length > 0 ? (
        <React.Fragment>
          <TriggersTimeSeries
            triggers={triggers}
            isLoading={isLoading}
            triggersData={triggersData}
            domainBounds={prevTimeSeriesWindow || timeSeriesWindow}
            monitorType={monitorType}
          />
          <POIChart
            isLoading={isLoading}
            data={poiData}
            onDragStart={() => setIsLoading(false)}
            highlightedArea={timeSeriesWindow}
            onDragEnd={handleDragEnd}
            xDomain={[poiTimeWindow.startTime, poiTimeWindow.endTime]}
            yDomain={[
              0,
              maxAlerts <= HistoryConstants.MIN_POI_Y_SCALE
                ? HistoryConstants.MIN_POI_Y_SCALE
                : maxAlerts,
            ]}
            isDarkMode={isDarkMode}
          />
          <EuiHorizontalRule margin="xs" />
          <Legend showBucketLegend={isBucketMonitor} />
        </React.Fragment>
      ) : (
        <EmptyHistory onShowTrigger={onShowTrigger} />
      )}
    </ContentPanel>
  );
};

MonitorHistory.propTypes = {
  triggers: PropTypes.array.isRequired,
  onShowTrigger: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  notifications: PropTypes.object.isRequired,
  monitorType: PropTypes.string.isRequired,
};

export default MonitorHistory;

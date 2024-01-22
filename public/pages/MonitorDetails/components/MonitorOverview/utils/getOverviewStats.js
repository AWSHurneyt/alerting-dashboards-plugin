/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import _ from 'lodash';
import { EuiBadge, EuiLink } from '@elastic/eui';
import moment from 'moment-timezone';
import getScheduleFromMonitor from './getScheduleFromMonitor';
import {
  DEFAULT_EMPTY_DATA,
  MONITOR_TYPE,
  OPENSEARCH_DASHBOARDS_AD_PLUGIN,
  SEARCH_TYPE,
} from '../../../../../utils/constants';
import { API_TYPES } from '../../../../CreateMonitor/components/ClusterMetricsMonitor/utils/clusterMetricsMonitorConstants';
import { getApiType } from '../../../../CreateMonitor/components/ClusterMetricsMonitor/utils/clusterMetricsMonitorHelpers';
import { DATA_SOURCES_FLYOUT_TYPE } from '../../../../../components/Flyout/flyouts/dataSources';

// TODO: used in multiple places, move into helper
export function getTime(time) {
  // TODO: Use OpenSearch Dashboards saved timezone (if there is one, if not THEN default to using browser)
  const momentTime = moment.tz(time, moment.tz.guess());
  if (time && momentTime.isValid()) return momentTime.format('MM/DD/YY h:mm a z');
  return DEFAULT_EMPTY_DATA;
}

function getMonitorType(searchType, monitor) {
  switch (searchType) {
    case SEARCH_TYPE.GRAPH:
      return 'Visual Graph';
    case SEARCH_TYPE.AD:
      return 'Anomaly Detector';
    case SEARCH_TYPE.CLUSTER_METRICS:
      const uri = _.get(monitor, 'inputs.0.uri');
      const apiType = getApiType(uri);
      return _.get(API_TYPES, `${apiType}.label`);
    default:
      return 'Extraction Query';
  }
}

function getMonitorLevelType(monitorType) {
  switch (monitorType) {
    case MONITOR_TYPE.QUERY_LEVEL:
      return 'Per query monitor';
    case MONITOR_TYPE.BUCKET_LEVEL:
      return 'Per bucket monitor';
    case MONITOR_TYPE.CLUSTER_METRICS:
      return 'Per cluster metrics monitor';
    case MONITOR_TYPE.DOC_LEVEL:
      return 'Per document monitor';
    case MONITOR_TYPE.COMPOSITE_LEVEL:
      return 'Composite monitor';
    default:
      // TODO: May be valuable to implement a toast that displays in this case.
      console.log('Unexpected monitor type:', monitorType);
      return '-';
  }
}

export const getFormattedDataSources = (monitor = {}) => {
  console.info(`hurneyt getFormattedDataSources::monitor = ${JSON.stringify(monitor, null, 4)}`);

  const monitorType = _.get(
    monitor,
    'monitor_type',
    _.get(monitor, 'workflow_type', MONITOR_TYPE.QUERY_LEVEL)
  );
  console.info(
    `hurneyt getFormattedDataSources::monitorType = ${JSON.stringify(monitorType, null, 4)}`
  );

  let dataSourcesPath = 'inputs.0.search.indices';
  switch (monitorType) {
    case MONITOR_TYPE.CLUSTER_METRICS:
      dataSourcesPath = `inputs.0.uri.clusters`;
      break;
    case MONITOR_TYPE.DOC_LEVEL:
      dataSourcesPath = `inputs.0.doc_level_input.indices`;
      break;
  }
  console.info(
    `hurneyt getFormattedDataSources::dataSourcesPath = ${JSON.stringify(dataSourcesPath, null, 4)}`
  );

  let dataSources = _.get(monitor, dataSourcesPath, [DEFAULT_EMPTY_DATA]);
  if (_.isArray(dataSources)) dataSources = _.sortBy(dataSources).join('\n');
  console.info(
    `hurneyt getFormattedDataSources::dataSources = ${JSON.stringify(dataSources, null, 4)}`
  );

  return dataSources;
};

const getDataSourcesDisplay = (dataSources = [], localClusterName, monitorType, setFlyout) => {
  const closeFlyout = () => {
    if (typeof setFlyout === 'function') setFlyout(null);
  };

  const openFlyout = () => {
    console.info(`hurneyt getDataSourcesDisplay openFlyout CALL`);
    if (typeof setFlyout === 'function') {
      console.info(`hurneyt getDataSourcesDisplay openFlyout CALL TRUE`);
      setFlyout({
        type: DATA_SOURCES_FLYOUT_TYPE,
        payload: {
          closeFlyout: closeFlyout,
          dataSources: dataSources,
          localClusterName: localClusterName,
          monitorType: monitorType,
        },
      });
    }
  };

  console.info(
    `hurneyt getDataSourcesDisplay::dataSources typeof = ${JSON.stringify(typeof dataSources)}`
  );
  console.info(
    `hurneyt getDataSourcesDisplay::dataSources = ${JSON.stringify(dataSources, null, 4)}`
  );
  return dataSources.length <= 1 ? (
    dataSources
  ) : (
    <>
      {dataSources[0]}&nbsp;
      <EuiBadge
        color={'primary'}
        onClick={openFlyout}
        onClickAriaLabel={'View all data sources'}
        data-test-subj={'dataSourcesFlyout_badge'}
      >
        View all {dataSources.length}
      </EuiBadge>
    </>
  );
};

export default function getOverviewStats(
  monitor,
  monitorId,
  monitorVersion,
  activeCount,
  detector,
  detectorId,
  localClusterName,
  setFlyout
) {
  const searchType = _.has(monitor, 'inputs[0].uri')
    ? SEARCH_TYPE.CLUSTER_METRICS
    : _.get(monitor, 'ui_metadata.search.searchType', 'query');

  const detectorOverview = detector
    ? [
        {
          header: 'Detector',
          value: (
            <EuiLink
              href={`${OPENSEARCH_DASHBOARDS_AD_PLUGIN}#/detectors/${detectorId}`}
              target="_blank"
            >
              {detector.name}
            </EuiLink>
          ),
        },
      ]
    : [];
  let monitorLevelType = _.get(monitor, 'monitor_type', undefined);
  if (!monitorLevelType) {
    monitorLevelType = _.get(monitor, 'ui_metadata.monitor_type', 'query_level_monitor');
  }

  let dataSourcesPath = 'inputs.0.search.indices';
  switch (monitorLevelType) {
    case MONITOR_TYPE.CLUSTER_METRICS:
      dataSourcesPath = `inputs.0.uri.clusters`;
      break;
    case MONITOR_TYPE.DOC_LEVEL:
      dataSourcesPath = `inputs.0.doc_level_input.indices`;
      break;
  }
  console.info(
    `hurneyt getFormattedDataSources::dataSourcesPath = ${JSON.stringify(dataSourcesPath, null, 4)}`
  );

  let dataSources = _.get(monitor, dataSourcesPath, [DEFAULT_EMPTY_DATA]);

  const overviewStats = [
    {
      header: 'Monitor type',
      value: getMonitorLevelType(monitorLevelType),
    },
    {
      header: 'Monitor definition type',
      value: getMonitorType(searchType, monitor),
    },
    ...detectorOverview,
    {
      header: 'Data sources',
      value: getDataSourcesDisplay(dataSources, localClusterName, monitorLevelType, setFlyout),
    },
    {
      header: 'Total active alerts',
      value: activeCount,
    },
    {
      header: 'Schedule',
      value: getScheduleFromMonitor(monitor),
    },
    {
      header: 'Last updated',
      value: getTime(monitor.last_update_time),
    },
    {
      header: 'Monitor ID',
      value: monitorId,
    },
    {
      header: 'Monitor version number',
      value: monitorVersion,
    },
    {
      /* There are 3 cases:
      1. Monitors created by older versions and never updated.
         These monitors won’t have User details in the monitor object. `monitor.user` will be null.
      2. Monitors are created when security plugin is disabled, these will have empty User object.
         (`monitor.user.name`, `monitor.user.roles` are empty )
      3. Monitors are created when security plugin is enabled, these will have an User object. */
      header: 'Last updated by',
      value: monitor.user && monitor.user.name ? monitor.user.name : '-',
    },
  ];

  return overviewStats;
}

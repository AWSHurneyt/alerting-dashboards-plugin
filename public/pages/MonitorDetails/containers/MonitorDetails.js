/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import MonitorDetailsV1 from './MonitorDetailsV1';
import MonitorDetailsV2 from './MonitorDetailsV2';
import { getDataSourceQueryObj } from '../../utils/helpers';
import { isPplMonitor as isPplMonitorUtil } from '../../../utils/pplHelpers';

const MonitorDetailsRouter = (props) => {
  const [isPplMonitor, setIsPplMonitor] = useState(undefined);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const resolveMonitorType = async () => {
      try {
        const dataSourceQuery = getDataSourceQueryObj();
        const monitorId = props.match?.params?.monitorId;
        if (monitorId) {
          const resp = await props.httpClient.get(
            `../api/alerting/monitors/${encodeURIComponent(monitorId)}`,
            dataSourceQuery
          );
          const monitor = resp?.resp ?? null;
          if (isMounted.current) {
            setIsPplMonitor(monitor ? isPplMonitorUtil(monitor) : false);
          }
          return;
        }
      } catch (err) {
        console.error('MonitorDetails: unable to determine monitor type', err);
      }
      if (isMounted.current) setIsPplMonitor(false);
    };

    resolveMonitorType();
  }, [props.location?.search, props.match?.params?.monitorId]);

  if (isPplMonitor === undefined) {
    return null;
  }

  if (isPplMonitor) {
    return <MonitorDetailsV2 {...props} />;
  }

  return <MonitorDetailsV1 {...props} />;
};

export default MonitorDetailsRouter;

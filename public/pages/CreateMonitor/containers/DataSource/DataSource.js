/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import PropTypes from 'prop-types';
import { EuiSpacer } from '@elastic/eui';
import MonitorIndex from '../MonitorIndex';
import MonitorTimeField from '../../components/MonitorTimeField';
import ContentPanel from '../../../../components/ContentPanel';
import { MONITOR_TYPE, SEARCH_TYPE } from '../../../../utils/constants';

const DataSource = ({
  values,
  dataTypes,
  httpClient,
  isMinimal = false,
  canCallGetRemoteIndexes,
  remoteMonitoringEnabled,
  landingDataSourceId,
}) => {
  const { monitor_type, searchType } = values;
  const displayTimeField =
    searchType === SEARCH_TYPE.GRAPH &&
    monitor_type !== MONITOR_TYPE.DOC_LEVEL &&
    monitor_type !== MONITOR_TYPE.CLUSTER_METRICS;

  const monitorIndexDisplay = (
    <>
      <MonitorIndex
        httpClient={httpClient}
        monitorType={monitor_type}
        canCallGetRemoteIndexes={canCallGetRemoteIndexes}
        remoteMonitoringEnabled={remoteMonitoringEnabled}
        landingDataSourceId={landingDataSourceId}
      />
      {displayTimeField && (
        <>
          <EuiSpacer />
          <MonitorTimeField dataTypes={dataTypes} />
        </>
      )}
    </>
  );

  if (isMinimal) {
    return { monitorIndexDisplay };
  }
  return (
    <ContentPanel title="Select data" titleSize="s" bodyStyles={{ padding: 'initial' }}>
      {monitorIndexDisplay}
    </ContentPanel>
  );
};

DataSource.propTypes = {
  values: PropTypes.object.isRequired,
  dataTypes: PropTypes.object.isRequired,
  httpClient: PropTypes.object.isRequired,
  notifications: PropTypes.object.isRequired,
  isMinimal: PropTypes.bool,
};

export default DataSource;

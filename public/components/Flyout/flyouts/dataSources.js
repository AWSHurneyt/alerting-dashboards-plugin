/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiBasicTable, EuiFlexGroup, EuiButtonIcon, EuiTitle, EuiFlexItem } from '@elastic/eui';
import { DEFAULT_EMPTY_DATA, MONITOR_TYPE } from '../../../utils/constants';
import _ from 'lodash';

export const DATA_SOURCES_FLYOUT_TYPE = 'dataSources';

const dataSources = ({
  closeFlyout = () => {},
  dataSources = [],
  localClusterName = '',
  monitorType = MONITOR_TYPE.QUERY_LEVEL,
}) => {
  const columns = [
    {
      field: 'cluster',
      name: 'Data connection',
      sortable: true,
      truncateText: true,
      // todo hurneyt
      // render: (clusters = [DEFAULT_EMPTY_DATA]) => (_.sortBy(clusters).join(', ')),
    },
  ];
  switch (monitorType) {
    case MONITOR_TYPE.CLUSTER_METRICS:
      // Cluster metrics monitors do not use indexes as data sources; excluding that column.
      break;
    default:
      columns.push({
        field: 'index',
        name: 'Index',
        sortable: true,
        truncateText: true,
        // todo hurneyt
        // render: (clusters = [DEFAULT_EMPTY_DATA]) => (_.sortBy(clusters).join(', ')),
      });
  }

  const indexItems = dataSources.map((dataSource = '', int) => {
    const item = { id: int };
    switch (monitorType) {
      case MONITOR_TYPE.CLUSTER_METRICS:
        item.cluster =
          dataSource === localClusterName ? `${dataSource} (Local)` : `${dataSource} (Remote)`;
        break;
      default:
        const shouldSplit = dataSource.includes(':');
        const splitIndex = dataSource.split(':');
        let clusterName = shouldSplit ? splitIndex[0] : localClusterName;
        // todo hurneyt needs to be fixed for cluster metrics monitors because they will just have a list of cluster name strings
        clusterName =
          clusterName === localClusterName ? `${clusterName} (Local)` : `${clusterName} (Remote)`;
        const indexName = shouldSplit ? splitIndex[1] : dataSource;
        item.cluster = clusterName;
        item.index = indexName;
    }
    return item;
  });

  console.info(`hurneyt dataSources::indexItems = ${JSON.stringify(indexItems, null, 4)}`);
  return {
    flyoutProps: {
      'aria-labelledby': 'dataSourcesFlyout',
      size: 'm',
      hideCloseButton: true,
      'data-test-subj': `dataSourcesFlyout`,
    },
    headerProps: { hasBorder: true },
    header: (
      <EuiFlexGroup justifyContent="flexStart" alignItems="center">
        <EuiFlexItem className={'eui-textTruncate'}>
          <EuiTitle
            className={'eui-textTruncate'}
            size={'m'}
            data-test-subj={'dataSourcesFlyout_header'}
          >
            <h3>{`Data sources`}</h3>
          </EuiTitle>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButtonIcon
            data-test-subj={'dataSourcesFlyout_closeButton'}
            iconType={'cross'}
            display={'empty'}
            iconSize={'m'}
            onClick={closeFlyout}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    ),
    footerProps: { style: { backgroundColor: '#F5F7FA' } },
    body: (
      <EuiBasicTable
        items={indexItems}
        itemId={(item) => item.id}
        columns={columns}
        pagination={true}
        isSelectable={false}
        hasActions={false}
        noItemsMessage={'No data sources configured for this monitor.'}
        data-test-subj={'dataSourcesFlyout_table'}
      />
    ),
  };
};

export default dataSources;

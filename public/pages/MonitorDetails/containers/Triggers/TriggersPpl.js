/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { EuiInMemoryTable, EuiIcon, EuiToolTip } from '@elastic/eui';
import _ from 'lodash';

import ContentPanel from '../../../../components/ContentPanel';
import { DEFAULT_EMPTY_DATA } from '../../../../utils/constants';
import { formatDuration } from '../../../CreateMonitor/containers/CreateMonitor/utils/pplAlertingHelpers';

const formatTriggerMode = (mode) => {
  if (!mode) return DEFAULT_EMPTY_DATA;
  switch (mode) {
    case 'result_set':
      return 'Per result';
    case 'per_execution':
    case 'execution':
    case 'once':
      return 'Once';
    default:
      return mode;
  }
};

const formatTriggerType = (type) => {
  if (!type) return DEFAULT_EMPTY_DATA;
  switch (type) {
    case 'number_of_results':
      return 'Number of results';
    case 'custom_script':
    case 'script':
      return 'Custom';
    default:
      return type;
  }
};

const getExpireDurationHeader = () => (
  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
    Expire duration
    <EuiToolTip content="Default to 7 days if not specified">
      <EuiIcon type="iInCircle" size="s" style={{ marginLeft: '4px' }} />
    </EuiToolTip>
  </span>
);

const normalizeTrigger = (trigger = {}) => ({
  ...trigger,
  id: trigger.id ?? trigger.name ?? `${trigger.type || 'trigger'}-${Math.random()}`,
});

const TriggersPpl = ({ monitor }) => {
  const [items, setItems] = useState([]);
  const [tableKey, setTableKey] = useState(`table-${Date.now()}`);
  const [sorting, setSorting] = useState({ sort: { field: 'name', direction: 'asc' } });
  const prevMonitorRef = useRef(monitor);

  useEffect(() => {
    const rawTriggers = Array.isArray(monitor?.triggers) ? monitor.triggers : [];
    const triggers = rawTriggers.map((trigger) => {
      const unwrapped = trigger.ppl_trigger ? trigger.ppl_trigger : trigger;
      return normalizeTrigger(unwrapped);
    });
    setItems(triggers);
  }, [monitor]);

  useEffect(() => {
    if (prevMonitorRef.current !== monitor) {
      setTableKey(`table-${Date.now()}-${Math.random()}`);
      prevMonitorRef.current = monitor;
    }
  }, [monitor]);

  const numOfTriggers = Array.isArray(monitor?.triggers) ? monitor.triggers.length : 0;

  const columns = [
    { field: 'name', name: 'Name', sortable: true, truncateText: true, width: '15%' },
    {
      field: 'mode',
      name: 'Trigger mode',
      sortable: false,
      width: '12%',
      render: formatTriggerMode,
    },
    {
      field: 'type',
      name: 'Trigger type',
      sortable: false,
      width: '12%',
      render: formatTriggerType,
    },
    {
      field: 'actions',
      name: 'Number of actions',
      sortable: true,
      width: '12%',
      render: (actions = []) => actions.length,
    },
    { field: 'severity', name: 'Severity', sortable: true, width: '10%' },
    {
      field: 'num_results_condition',
      name: 'Num results condition',
      sortable: false,
      width: '12%',
      render: (value, item) =>
        item.type === 'number_of_results' ? value || DEFAULT_EMPTY_DATA : DEFAULT_EMPTY_DATA,
    },
    {
      field: 'num_results_value',
      name: 'Num results value',
      sortable: false,
      width: '12%',
      render: (value, item) =>
        item.type === 'number_of_results' ? value ?? DEFAULT_EMPTY_DATA : DEFAULT_EMPTY_DATA,
    },
    {
      name: 'Custom condition',
      sortable: false,
      width: '20%',
      render: (item) =>
        item.type !== 'number_of_results'
          ? _.get(item, 'condition.script.source') || DEFAULT_EMPTY_DATA
          : DEFAULT_EMPTY_DATA,
    },
    {
      field: 'expires_minutes',
      name: getExpireDurationHeader(),
      sortable: false,
      width: '12%',
      render: (value) => formatDuration(value),
    },
    {
      field: 'throttle_minutes',
      name: 'Throttle duration',
      sortable: false,
      width: '12%',
      render: (value) => formatDuration(value),
    },
  ];

  return (
    <ContentPanel
      title={`Triggers (${numOfTriggers})`}
      titleSize="s"
      bodyStyles={{ padding: 'initial' }}
    >
      <EuiInMemoryTable
        items={items}
        itemId="id"
        key={tableKey}
        columns={columns}
        sorting={sorting}
        onTableChange={({ sort }) => sort && setSorting({ sort })}
        noItemsMessage={'There are no triggers.'}
      />
    </ContentPanel>
  );
};

TriggersPpl.propTypes = {
  monitor: PropTypes.object.isRequired,
};

export default TriggersPpl;

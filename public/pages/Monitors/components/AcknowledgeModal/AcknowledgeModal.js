/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { EuiConfirmModal, EuiInMemoryTable, EuiOverlayMask } from '@elastic/eui';

const renderTime = (time) => {
  const momentTime = moment(time);
  if (time && momentTime.isValid()) return momentTime.format('MM/DD/YY h:mm a');
  return '--';
};

const columns = [
  { field: 'monitor_name', name: 'Monitor', truncateText: true },
  { field: 'trigger_name', name: 'Trigger', truncateText: true },
  { field: 'start_time', name: 'Start Time', truncateText: false, render: renderTime },
  { field: 'severity', name: 'Severity', align: 'right', truncateText: false },
];

const AcknowledgeModal = ({ alerts, totalAlerts, onClickCancel, onAcknowledge }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const onConfirm = () => {
    if (!selectedItems.length) return;
    onAcknowledge(selectedItems);
  };

  return (
    <EuiOverlayMask>
      <EuiConfirmModal
        title="Acknowledge Alerts"
        maxWidth={650}
        onCancel={onClickCancel}
        onConfirm={onConfirm}
        cancelButtonText="cancel"
        confirmButtonText="Acknowledge"
      >
        <p>Select which alerts to acknowledge.</p>
        <EuiInMemoryTable
          items={alerts}
          itemId="id"
          columns={columns}
          isSelectable={true}
          selection={{ onSelectionChange: setSelectedItems }}
          style={{
            borderTop: '1px solid #D9D9D9',
            borderLeft: '1px solid #D9D9D9',
            borderRight: '1px solid #D9D9D9',
          }}
        />
      </EuiConfirmModal>
    </EuiOverlayMask>
  );
};

AcknowledgeModal.propTypes = {
  alerts: PropTypes.arrayOf(PropTypes.any).isRequired,
  totalAlerts: PropTypes.number.isRequired,
  onClickCancel: PropTypes.func.isRequired,
  onAcknowledge: PropTypes.func.isRequired,
};

export default AcknowledgeModal;

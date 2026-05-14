/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

jest.mock(
  '../../../../components/ContentPanel',
  () =>
    ({ children, actions }) =>
      children
);
jest.mock('../../../../utils/constants', () => ({
  DEFAULT_EMPTY_DATA: '-',
}));
jest.mock('../../../CreateMonitor/containers/CreateMonitor/utils/pplAlertingHelpers', () => ({
  formatDuration: jest.fn((m) => `${m} min`),
}));

import TriggersPpl from './TriggersPpl';

const defaultProps = {
  monitor: { name: 'Test', triggers: [] },
  onEditTrigger: jest.fn(),
  onCreateTrigger: jest.fn(),
};

describe('TriggersPpl', () => {
  test('renders empty state', () => {
    const { container } = render(<TriggersPpl {...defaultProps} />);
    expect(container).toBeTruthy();
  });

  test('renders with triggers', () => {
    const triggers = [
      {
        name: 'T1',
        severity: 'high',
        type: 'number_of_results',
        num_results_condition: '>=',
        num_results_value: 1,
        actions: [],
      },
      {
        name: 'T2',
        severity: 'low',
        type: 'custom_condition',
        custom_condition: 'true',
        actions: [{ name: 'a1' }],
      },
    ];
    const { container } = render(
      <TriggersPpl {...defaultProps} monitor={{ ...defaultProps.monitor, triggers }} />
    );
    expect(container.textContent).toContain('T1');
    expect(container.textContent).toContain('T2');
  });
});

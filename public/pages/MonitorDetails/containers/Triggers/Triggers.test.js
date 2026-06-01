/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Triggers from './Triggers';
import { MONITOR_TYPE } from '../../../../utils/constants';
import { TRIGGER_TYPE } from '../../../CreateTrigger/containers/CreateTrigger/utils/constants';

const props = {
  monitor: {
    triggers: [{ name: 'Random Trigger', severity: 1, actions: [{ name: 'Random Action' }] }],
  },
  delegateMonitors: [],
  updateMonitor: jest.fn(),
};

jest.mock('uuid', () => {
  let value = 0;
  return {
    v4: () => value++,
  };
});

describe('Triggers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders', () => {
    const { container } = render(<Triggers {...props} />);
    expect(container).toMatchSnapshot();
  });

  test('renders trigger name', () => {
    const { container } = render(<Triggers {...props} />);
    expect(container.textContent).toContain('Random Trigger');
  });

  test('updates items when monitor prop changes', () => {
    const { container, rerender } = render(<Triggers {...props} />);
    expect(container.textContent).toContain('Random Trigger');

    rerender(
      <Triggers
        {...props}
        monitor={{
          triggers: [
            { query_level_trigger: { name: 'Trigger A', severity: '1', actions: [] } },
            { query_level_trigger: { name: 'Trigger B', severity: '2', actions: [] } },
          ],
        }}
      />
    );
    expect(container.textContent).toContain('Trigger A');
    expect(container.textContent).toContain('Trigger B');
  });
});

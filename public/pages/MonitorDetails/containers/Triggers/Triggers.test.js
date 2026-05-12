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
});

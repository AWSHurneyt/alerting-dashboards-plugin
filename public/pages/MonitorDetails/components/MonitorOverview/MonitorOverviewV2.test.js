/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

jest.mock(
  '../../../../components/ContentPanel/index',
  () =>
    ({ children }) =>
      children
);
jest.mock(
  '../OverviewStat/index',
  () =>
    ({ value }) =>
      value
);
jest.mock('./utils/getOverviewStatsV2', () =>
  jest.fn(() => ({
    firstRow: [
      { header: 'State', value: 'Enabled' },
      { header: 'Active alerts', value: '0' },
    ],
    secondRow: [{ header: 'Schedule', value: 'Every 1 minute' }],
  }))
);
jest.mock('../RelatedMonitors/RelatedMonitors', () => ({ RelatedMonitors: () => null }));
jest.mock('../RelatedMonitors/RelatedMonitorsFlyout', () => ({
  RelatedMonitorsFlyout: () => null,
}));
jest.mock('../../../utils/helpers', () => ({ getURL: jest.fn(() => '/monitors/mon-1') }));

import MonitorOverviewV2 from './MonitorOverviewV2';

describe('MonitorOverviewV2', () => {
  test('renders overview stats', () => {
    const { container } = render(
      <MonitorOverviewV2
        monitor={{
          name: 'Test',
          enabled: true,
          schedule: { period: { interval: 1, unit: 'MINUTES' } },
        }}
        monitorId="mon-1"
        activeCount={0}
        delegateMonitors={[]}
      />
    );
    expect(container.textContent).toContain('Enabled');
  });
});

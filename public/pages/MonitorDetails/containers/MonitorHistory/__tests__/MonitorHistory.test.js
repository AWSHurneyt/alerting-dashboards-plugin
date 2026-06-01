/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import moment from 'moment-timezone';
import { render, waitFor } from '@testing-library/react';
import MonitorHistory from '../MonitorHistory';

moment.tz.setDefault('America/Los_Angeles');

describe('<MonitorHistory/>', () => {
  const triggers = [
    { name: 'Trigger 1', id: '1' },
    { name: 'Trigger 2', id: '2' },
  ];
  const httpClient = {
    post: jest.fn().mockResolvedValue({
      ok: true,
      resp: { aggregations: { max_alerts: { value: 0 }, alerts_over_time: { buckets: [] } } },
    }),
    get: jest.fn().mockResolvedValue({ ok: true, alerts: [] }),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    httpClient.post.mockResolvedValue({
      ok: true,
      resp: { aggregations: { max_alerts: { value: 0 }, alerts_over_time: { buckets: [] } } },
    });
    httpClient.get.mockResolvedValue({ ok: true, alerts: [] });
  });

  test('should show EmptyHistory if no triggers found', () => {
    const { container } = render(
      <MonitorHistory
        httpClient={httpClient}
        monitorId={'123'}
        onShowTrigger={jest.fn()}
        triggers={[]}
      />
    );
    expect(container.textContent).toContain('There are no triggers');
  });

  test('should execute getPOIData on componentDidMount', async () => {
    render(
      <MonitorHistory
        httpClient={httpClient}
        monitorId={'123'}
        onShowTrigger={jest.fn()}
        triggers={triggers}
      />
    );
    await waitFor(() => {
      expect(httpClient.post).toHaveBeenCalled();
    });
  });

  test('should execute getAlerts on componentDidMount', async () => {
    render(
      <MonitorHistory
        httpClient={httpClient}
        monitorId={'123'}
        onShowTrigger={jest.fn()}
        triggers={triggers}
      />
    );
    await waitFor(() => {
      expect(httpClient.get).toHaveBeenCalled();
    });
  });

  test('renders with triggers', () => {
    const { container } = render(
      <MonitorHistory
        httpClient={httpClient}
        monitorId={'123'}
        onShowTrigger={jest.fn()}
        triggers={triggers}
      />
    );
    expect(container).toBeTruthy();
    expect(container.querySelector('.rv-xy-plot')).toBeTruthy();
  });

  test('should get highlight windowSize', async () => {
    render(
      <MonitorHistory
        httpClient={httpClient}
        monitorId={'123'}
        onShowTrigger={jest.fn()}
        triggers={triggers}
      />
    );
    await waitFor(() => {
      expect(httpClient.post).toHaveBeenCalled();
    });
  });

  test('should create appropriate alerts data', async () => {
    httpClient.get.mockResolvedValue({
      ok: true,
      alerts: [{ trigger_id: '1', start_time: Date.now(), state: 'ACTIVE' }],
    });
    render(
      <MonitorHistory
        httpClient={httpClient}
        monitorId={'123'}
        onShowTrigger={jest.fn()}
        triggers={triggers}
      />
    );
    await waitFor(() => {
      expect(httpClient.get).toHaveBeenCalled();
    });
  });
});

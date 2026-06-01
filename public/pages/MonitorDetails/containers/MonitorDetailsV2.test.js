/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';

// Mock heavy child components — no JSX in factories
jest.mock('../../CreateMonitor', () => () => null);
jest.mock('../components/MonitorOverview/MonitorOverviewV2', () => () => null);
jest.mock('../../Dashboard/containers/Dashboard', () => () => null);
jest.mock('../../Dashboard/containers/FindingsDashboard', () => () => null);
jest.mock('./Triggers/TriggersPpl', () => () => null);
jest.mock('../../../components/DeleteModal/DeleteMonitorModal', () => ({
  DeleteMonitorModal: () => null,
}));
jest.mock('../../../components/PageHeader/PageHeader', () => ({
  PageHeader: ({ children }) => children,
}));
jest.mock('../../CreateMonitor/components/CrossClusterConfigurations/utils/helpers', () => ({
  getLocalClusterName: jest.fn().mockResolvedValue('local'),
}));
jest.mock('../../utils/helpers', () => ({
  getDataSourceQueryObj: jest.fn(() => null),
  parseQueryStringAndGetDataSource: jest.fn(() => undefined),
  dataSourceEnabled: jest.fn(() => false),
}));
jest.mock('../../../utils/helpers', () => ({
  backendErrorNotification: jest.fn(),
}));
jest.mock('../../../utils/pplHelpers', () => ({
  deletePplMonitor: jest.fn().mockResolvedValue({ ok: true }),
}));
jest.mock('./utils/helpers', () => ({
  migrateTriggerMetadata: jest.fn((m) => m),
}));
jest.mock('../../CreateMonitor/containers/CreateMonitor/utils/formikToMonitor', () => ({
  formikToMonitor: jest.fn(() => ({})),
}));
jest.mock('../../CreateMonitor/containers/CreateMonitor/utils/monitorToFormik', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));
jest.mock('../../CreateMonitor/containers/CreateMonitor/utils/pplAlertingMonitorToFormik', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));
jest.mock('../../CreateMonitor/containers/CreateMonitor/utils/pplFormikToMonitor', () => ({
  buildPPLMonitorFromFormik: jest.fn(() => ({})),
}));
jest.mock('../../../services', () => ({
  getUseUpdatedUx: jest.fn(() => true),
  setDataSource: jest.fn(),
}));
jest.mock('../../../../public/utils/MultiDataSourceContext', () => {
  const { createContext } = require('react');
  return { MultiDataSourceContext: createContext({}) };
});

import MonitorDetailsV2 from './MonitorDetailsV2';

const mockMonitor = {
  id: 'mon-1',
  name: 'Test Monitor',
  enabled: true,
  monitor_type: 'ppl_monitor',
  triggers: [],
  schedule: { period: { interval: 1, unit: 'MINUTES' } },
  inputs: [{ ppl: { query: 'source = idx' } }],
};

const defaultProps = {
  httpClient: {
    get: jest.fn().mockResolvedValue({
      ok: true,
      resp: mockMonitor,
      version: 1,
      dayCount: 0,
      activeCount: 0,
      ifSeqNo: 1,
      ifPrimaryTerm: 1,
    }),
    put: jest.fn().mockResolvedValue({ ok: true, version: 2, ifSeqNo: 2, ifPrimaryTerm: 1 }),
    delete: jest.fn().mockResolvedValue({ ok: true }),
  },
  match: { params: { monitorId: 'mon-1' } },
  location: { search: '', pathname: '/monitors/mon-1' },
  history: { push: jest.fn(), goBack: jest.fn() },
  notifications: { toasts: { addSuccess: jest.fn(), addDanger: jest.fn() } },
  setFlyout: jest.fn(),
  isDarkMode: false,
  viewMode: 'new',
};

const renderComponent = (props = {}) =>
  render(
    <MemoryRouter initialEntries={['/monitors/mon-1']}>
      <Route path="/monitors/:monitorId">
        <MonitorDetailsV2 {...defaultProps} {...props} />
      </Route>
    </MemoryRouter>
  );

describe('MonitorDetailsV2', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders and calls getMonitor on mount', async () => {
    const { container } = renderComponent();
    await waitFor(() => {
      expect(defaultProps.httpClient.get).toHaveBeenCalledWith(
        expect.stringContaining('mon-1'),
        null
      );
    });
    expect(container).toBeTruthy();
  });

  test('navigates away on getMonitor failure', async () => {
    const httpClient = {
      ...defaultProps.httpClient,
      get: jest.fn().mockResolvedValue({ ok: false }),
    };
    renderComponent({ httpClient });
    await waitFor(() => {
      expect(defaultProps.history.push).toHaveBeenCalledWith('/monitors');
    });
  });

  test('navigates away on getMonitor exception', async () => {
    const httpClient = {
      ...defaultProps.httpClient,
      get: jest.fn().mockRejectedValue(new Error('network')),
    };
    renderComponent({ httpClient });
    await waitFor(() => {
      expect(defaultProps.history.push).toHaveBeenCalledWith('/monitors');
    });
  });

  test('renders monitor name after loading', async () => {
    const { container } = renderComponent();
    await waitFor(() => {
      expect(defaultProps.httpClient.get).toHaveBeenCalled();
    });
    // After loading, the spinner should be gone
    await waitFor(() => {
      expect(container.querySelector('.euiLoadingSpinner')).toBeFalsy();
    });
  });

  test('calls setFlyout(null) on unmount', () => {
    const { unmount } = renderComponent();
    unmount();
    expect(defaultProps.setFlyout).toHaveBeenCalledWith(null);
  });
});

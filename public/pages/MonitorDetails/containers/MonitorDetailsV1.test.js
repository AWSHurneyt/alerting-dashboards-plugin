/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';

jest.mock('../../CreateMonitor', () => () => null);
jest.mock('../components/MonitorOverview', () => () => null);
jest.mock('./MonitorHistory', () => () => null);
jest.mock('../../Dashboard/containers/Dashboard', () => () => null);
jest.mock('../../Dashboard/containers/FindingsDashboard', () => () => null);
jest.mock('./Triggers', () => () => null);
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
  deleteMonitor: jest.fn().mockResolvedValue({ ok: true }),
}));
jest.mock('./utils/helpers', () => ({
  migrateTriggerMetadata: jest.fn((m) => m),
}));
jest.mock('./Triggers/Triggers', () => ({
  getUnwrappedTriggers: jest.fn(() => []),
}));
jest.mock('../../CreateMonitor/containers/CreateMonitor/utils/formikToMonitor', () => ({
  formikToMonitor: jest.fn(() => ({})),
}));
jest.mock('../../CreateMonitor/containers/CreateMonitor/utils/monitorToFormik', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));
jest.mock('../../../services', () => ({
  getUseUpdatedUx: jest.fn(() => false),
  setDataSource: jest.fn(),
}));
jest.mock('../../../../public/utils/MultiDataSourceContext', () => {
  const { createContext } = require('react');
  return { MultiDataSourceContext: createContext({}) };
});

import MonitorDetailsV1 from './MonitorDetailsV1';

const mockMonitor = {
  id: 'mon-1',
  name: 'Legacy Monitor',
  enabled: true,
  monitor_type: 'monitor',
  triggers: [],
  schedule: { period: { interval: 1, unit: 'MINUTES' } },
  inputs: [{ search: { indices: ['idx'], query: {} } }],
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
    put: jest.fn().mockResolvedValue({ ok: true, version: 2 }),
  },
  match: { params: { monitorId: 'mon-1' } },
  location: { search: '', pathname: '/monitors/mon-1' },
  history: { push: jest.fn(), goBack: jest.fn() },
  notifications: { toasts: { addSuccess: jest.fn(), addDanger: jest.fn() } },
  setFlyout: jest.fn(),
  isDarkMode: false,
};

const renderComponent = (props = {}) =>
  render(
    <MemoryRouter initialEntries={['/monitors/mon-1']}>
      <Route path="/monitors/:monitorId">
        <MonitorDetailsV1 {...defaultProps} {...props} />
      </Route>
    </MemoryRouter>
  );

describe('MonitorDetailsV1', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders and calls getMonitor on mount', async () => {
    renderComponent();
    await waitFor(() => {
      expect(defaultProps.httpClient.get).toHaveBeenCalledWith(
        expect.stringContaining('mon-1'),
        null
      );
    });
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

  test('calls setFlyout(null) on unmount', () => {
    const { unmount } = renderComponent();
    unmount();
    expect(defaultProps.setFlyout).toHaveBeenCalledWith(null);
  });
});

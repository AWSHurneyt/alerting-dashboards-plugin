/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock child components and utilities
jest.mock('../../components/CustomSteps', () => () => null);
jest.mock(
  '../../../CreateTrigger/containers/ConfigureTriggers/ConfigureTriggersPpl',
  () => () => null
);
jest.mock('../../components/QueryPerformance/QueryPerformance', () => ({
  getPerformanceModal: jest.fn(() => null),
}));
jest.mock('../../components/QueryEditor', () => ({ QueryEditor: () => null }));
jest.mock('../../../../components/DataTable', () => ({ AlertingDataTable: () => null }));
jest.mock('../../../../components/PageHeader/PageHeader', () => ({
  PageHeader: ({ children }) => children,
}));
jest.mock('../../../../utils/SubmitErrorHandler', () => ({ SubmitErrorHandler: () => null }));
jest.mock('../../../utils/helpers', () => ({
  isDataSourceChanged: jest.fn(() => false),
  getDataSourceQueryObj: jest.fn(() => null),
  dataSourceEnabled: jest.fn(() => false),
}));
jest.mock('./utils/pplAlertingHelpers', () => ({
  getInitialValues: jest.fn(() => ({
    name: 'Test',
    pplQuery: 'source = idx',
    searchType: 'query',
    monitor_mode: 'ppl',
    triggerDefinitions: [],
  })),
  getPlugins: jest.fn().mockResolvedValue([]),
  runPPLPreview: jest.fn().mockResolvedValue({ datarows: [], schema: [] }),
  submitPPL: jest.fn(),
  extractIndicesFromPPL: jest.fn(() => ['idx']),
  findCommonDateFields: jest
    .fn()
    .mockResolvedValue({ commonDateFields: ['@timestamp'], error: null }),
  addTimeFilterToQuery: jest.fn((q) => q),
  computeLookBackMinutes: jest.fn(() => 60),
}));
jest.mock('./utils/constants', () => ({
  FORMIK_INITIAL_VALUES: { name: '', pplQuery: '', triggerDefinitions: [] },
  RECOMMENDED_DURATION: { value: 1, unit: 'MINUTES' },
  LOOKBACK_WINDOW_MAX_MINUTES: 10080,
}));
jest.mock('../../../../services', () => ({
  setDataSource: jest.fn(),
  isPplAlertingEnabled: jest.fn(() => true),
}));
jest.mock('../../../../utils/constants', () => ({
  MONITOR_TYPE: { QUERY_LEVEL: 'monitor' },
  SEARCH_TYPE: { QUERY: 'query' },
}));
jest.mock('../../../CreateTrigger/containers/CreateTrigger/utils/triggerToFormikPpl', () => ({
  triggerToFormikPpl: jest.fn(() => ({})),
}));
jest.mock('../../../../utils/CoreContext', () => {
  const { createContext } = require('react');
  return { CoreContext: createContext({ http: {} }) };
});

import PplAlertingCreateMonitor from './PplAlertingCreateMonitor';

const defaultProps = {
  httpClient: {
    get: jest.fn().mockResolvedValue({ ok: true, resp: [] }),
    post: jest.fn().mockResolvedValue({ ok: true, resp: {} }),
  },
  location: { search: '', pathname: '/create-monitor' },
  history: { push: jest.fn(), goBack: jest.fn() },
  notifications: { toasts: { addSuccess: jest.fn(), addDanger: jest.fn() } },
  edit: false,
  monitorToEdit: null,
  isDarkMode: false,
  setFlyout: jest.fn(),
  match: { params: {} },
};

describe('PplAlertingCreateMonitor', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders create form', async () => {
    const { container } = render(
      <MemoryRouter>
        <PplAlertingCreateMonitor {...defaultProps} />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  test('renders in edit mode', async () => {
    const { container } = render(
      <MemoryRouter>
        <PplAlertingCreateMonitor
          {...defaultProps}
          edit={true}
          monitorToEdit={{ name: 'Existing', ppl_monitor: { query: 'source = idx' } }}
        />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  test('calls getPlugins on mount', async () => {
    const { getPlugins } = require('./utils/pplAlertingHelpers');
    render(
      <MemoryRouter>
        <PplAlertingCreateMonitor {...defaultProps} />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(getPlugins).toHaveBeenCalled();
    });
  });
});

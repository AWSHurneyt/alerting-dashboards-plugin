/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../ConfigureActions/ConfigureActionsPpl', () => () => null);
jest.mock('../../DefineTrigger/DefineTriggerPpl', () => () => null);
jest.mock('../../../../../utils/SubmitErrorHandler', () => ({ SubmitErrorHandler: () => null }));
jest.mock('../../../../../utils/helpers', () => ({
  backendErrorNotification: jest.fn(),
}));
jest.mock('../../../utils/helper', () => ({
  getTimeZone: jest.fn(() => 'UTC'),
}));
jest.mock('../../../../utils/helpers', () => ({
  getDataSourceQueryObj: jest.fn(() => null),
  dataSourceEnabled: jest.fn(() => false),
}));
jest.mock('../../../../CreateMonitor/containers/CreateMonitor/utils/pplAlertingHelpers', () => ({
  submitPPL: jest.fn(),
  addTimeFilterToQuery: jest.fn((q) => q),
  computeLookBackMinutes: jest.fn(() => 60),
}));

import CreateTriggerPpl from './CreateTriggerPpl';

const defaultProps = {
  edit: false,
  monitorValues: { name: 'Test', pplQuery: 'source = idx', triggerDefinitions: [] },
  monitor: { id: 'mon-1', name: 'Test', triggers: [] },
  httpClient: {
    get: jest.fn().mockResolvedValue({ ok: true }),
    post: jest.fn().mockResolvedValue({ ok: true }),
  },
  notifications: { toasts: { addSuccess: jest.fn(), addDanger: jest.fn() } },
  setFlyout: jest.fn(),
  location: { pathname: '/monitors/mon-1', search: '' },
  history: { push: jest.fn(), goBack: jest.fn() },
  match: { params: { monitorId: 'mon-1' } },
  isDarkMode: false,
  triggerToEdit: [],
};

describe('CreateTriggerPpl', () => {
  test('renders create form', () => {
    const { container } = render(
      <MemoryRouter>
        <CreateTriggerPpl {...defaultProps} />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });

  test('renders edit form', () => {
    const { container } = render(
      <MemoryRouter>
        <CreateTriggerPpl
          {...defaultProps}
          edit={true}
          triggerToEdit={[{ name: 'T1', severity: 'high' }]}
        />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});

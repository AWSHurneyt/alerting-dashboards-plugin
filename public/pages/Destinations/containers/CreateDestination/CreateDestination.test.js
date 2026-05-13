/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock(
  '../../../../components/ContentPanel',
  () =>
    ({ children }) =>
      children
);
jest.mock('../../../../components/SubHeader', () => () => null);
jest.mock('../../../../components/FormControls', () => ({
  FormikFieldText: () => null,
  FormikSelect: () => null,
}));
jest.mock('../../../../utils/SubmitErrorHandler', () => ({ SubmitErrorHandler: () => null }));
jest.mock('../../components/createDestinations', () => ({
  Webhook: () => null,
  CustomWebhook: () => null,
  Email: () => null,
}));
jest.mock('./utils/constants', () => ({
  formikInitialValues: { name: '', type: 'slack', slack: { url: '' } },
}));
jest.mock('../../utils/constants', () => ({
  DESTINATION_OPTIONS: [{ value: 'slack', text: 'Slack' }],
  DESTINATION_TYPE: {
    SLACK: 'slack',
    CHIME: 'chime',
    CUSTOM_HOOK: 'custom_webhook',
    EMAIL: 'email',
  },
}));
jest.mock('./utils/validations', () => ({
  validateDestinationName: jest.fn(),
  validateDestinationType: jest.fn(),
}));
jest.mock('./utils/formikToDestination', () => ({
  formikToDestination: jest.fn(() => ({ name: 'test', type: 'slack' })),
}));
jest.mock('./utils/destinationToFormik', () => ({
  destinationToFormik: jest.fn(() => ({ name: 'Existing', type: 'slack' })),
}));
jest.mock('../../utils/helpers', () => ({
  getAllowList: jest.fn().mockResolvedValue(['slack', 'chime', 'custom_webhook']),
}));
jest.mock('../../../../utils/helpers', () => ({
  backendErrorNotification: jest.fn(),
}));
jest.mock('../../../utils/helpers', () => ({
  getDataSourceQueryObj: jest.fn(() => null),
  dataSourceEnabled: jest.fn(() => false),
}));

import CreateDestination from './CreateDestination';

const defaultProps = {
  httpClient: {
    get: jest.fn().mockResolvedValue({ ok: true, destinations: [], totalDestinations: 0 }),
    post: jest.fn().mockResolvedValue({ ok: true, resp: { _id: 'dest-1' } }),
    put: jest.fn().mockResolvedValue({ ok: true, resp: { _id: 'dest-1' } }),
  },
  location: { search: '', pathname: '/destinations/create' },
  history: { push: jest.fn(), goBack: jest.fn() },
  notifications: { toasts: { addSuccess: jest.fn(), addDanger: jest.fn() } },
  edit: false,
  match: { params: {} },
};

describe('CreateDestination', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders create form', async () => {
    const { container } = render(
      <MemoryRouter>
        <CreateDestination {...defaultProps} />
      </MemoryRouter>
    );
    await waitFor(() => expect(container).toBeTruthy());
  });

  test('fetches allow list on mount', async () => {
    const { getAllowList } = require('../../utils/helpers');
    render(
      <MemoryRouter>
        <CreateDestination {...defaultProps} />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(getAllowList).toHaveBeenCalled();
    });
  });

  test('renders in edit mode', async () => {
    const httpClient = {
      ...defaultProps.httpClient,
      get: jest
        .fn()
        .mockResolvedValue({
          ok: true,
          destinations: [{ id: 'dest-1', name: 'Existing', type: 'slack' }],
          totalDestinations: 1,
        }),
    };
    const { container } = render(
      <MemoryRouter>
        <CreateDestination
          {...defaultProps}
          httpClient={httpClient}
          edit={true}
          match={{ params: { destinationId: 'dest-1' } }}
        />
      </MemoryRouter>
    );
    await waitFor(() => expect(container).toBeTruthy());
  });
});

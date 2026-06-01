/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Formik } from 'formik';

jest.mock('../../components/Action', () => () => null);
jest.mock('../../components/ActionEmptyPrompt', () => () => null);
jest.mock('../../components/AddActionButton/AddActionButtonPpl', () => () => null);
jest.mock('../../components/Action/actions/MessagePpl', () => () => null);
jest.mock('../../../Destinations/utils/helpers', () => ({
  getAllowList: jest.fn().mockResolvedValue([]),
}));
jest.mock('../../../../utils/helpers', () => ({
  backendErrorNotification: jest.fn(),
}));
jest.mock('../CreateTrigger/utils/constants', () => ({
  TRIGGER_TYPE: {
    QUERY_LEVEL: 'query_level_trigger',
    BUCKET_LEVEL: 'bucket_level_trigger',
    DOC_LEVEL: 'document_level_trigger',
    COMPOSITE_LEVEL: 'chained_alert_trigger',
  },
}));
jest.mock('../CreateTrigger/utils/formikToTrigger', () => ({
  formikToTrigger: jest.fn(() => [{ query_level_trigger: { name: 'test', actions: [] } }]),
}));
jest.mock('../../utils/helper', () => ({
  getChannelOptions: jest.fn(() => []),
  toChannelType: jest.fn(() => ''),
}));
jest.mock('../../components/AddActionButton/utils', () => ({
  getInitialPplActionValues: jest.fn(() => ({ name: '', destination_id: '' })),
}));
jest.mock('../../../utils/helpers', () => ({
  getDataSourceId: jest.fn(() => undefined),
  getDataSourceQueryObj: jest.fn(() => null),
  dataSourceEnabled: jest.fn(() => false),
}));

import ConfigureActionsPpl from './ConfigureActionsPpl';

const defaultProps = {
  httpClient: {
    get: jest.fn().mockResolvedValue({ ok: true, destinations: [], totalDestinations: 0 }),
    post: jest.fn().mockResolvedValue({ ok: true }),
  },
  values: { actions: [] },
  plugins: [],
  notifications: { toasts: { addDanger: jest.fn() } },
  arrayHelpers: { push: jest.fn(), remove: jest.fn() },
  context: { monitor: {}, trigger: { query_level_trigger: { name: 'test' } } },
  setFlyout: jest.fn(),
  fieldPath: '',
  triggerIndex: 0,
  monitorType: 'monitor',
};

describe('ConfigureActionsPpl', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders empty state', async () => {
    const { container } = render(
      <Formik initialValues={{ actions: [] }} onSubmit={() => {}}>
        <ConfigureActionsPpl {...defaultProps} />
      </Formik>
    );
    await waitFor(() => expect(container).toBeTruthy());
  });

  test('loads channels on mount', async () => {
    render(
      <Formik initialValues={{ actions: [] }} onSubmit={() => {}}>
        <ConfigureActionsPpl {...defaultProps} />
      </Formik>
    );
    await waitFor(() => {
      expect(defaultProps.httpClient.get).toHaveBeenCalled();
    });
  });
});

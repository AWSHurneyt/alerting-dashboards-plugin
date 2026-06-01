/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Formik } from 'formik';

jest.mock(
  '../../../../components/ContentPanel',
  () =>
    ({ children }) =>
      children
);
jest.mock('../../components/AddTriggerButton/AddTriggerButtonPpl', () => () => null);
jest.mock('../../components/TriggerEmptyPrompt', () => () => null);
jest.mock(
  '../../../../components/FeatureAnywhereContextMenu/EnhancedAccordion',
  () =>
    ({ children }) =>
      children
);
jest.mock('../DefineTrigger/DefineTriggerPpl', () => () => null);
jest.mock('../../../MonitorDetails/containers/Triggers/Triggers', () => ({
  MAX_TRIGGERS: 10,
}));
jest.mock('../../../CreateMonitor/containers/CreateMonitor/utils/monitorToFormik', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));
jest.mock('../../../../utils/helpers', () => ({
  backendErrorNotification: jest.fn(),
  inputLimitText: jest.fn(() => ''),
}));
jest.mock('../../../../../public/pages/utils/helpers', () => ({
  getDataSourceQueryObj: jest.fn(() => null),
  dataSourceEnabled: jest.fn(() => false),
}));
jest.mock('../../../CreateMonitor/containers/CreateMonitor/utils/pplAlertingHelpers', () => ({
  addTimeFilterToQuery: jest.fn((q) => q),
  computeLookBackMinutes: jest.fn(() => 60),
}));

import ConfigureTriggersPpl from './ConfigureTriggersPpl';

const defaultProps = {
  httpClient: {
    get: jest.fn().mockResolvedValue({ ok: true }),
    post: jest
      .fn()
      .mockResolvedValue({ ok: true, resp: { datarows: [[5]], schema: [{ name: 'count' }] } }),
  },
  monitorValues: {
    name: 'Test',
    pplQuery: 'source = idx | stats count()',
    useLookBackWindow: true,
    lookBackAmount: 1,
    lookBackUnit: 'hours',
    timestampField: '@timestamp',
  },
  triggerArrayHelpers: { push: jest.fn(), remove: jest.fn(), replace: jest.fn() },
  setFlyout: jest.fn(),
  notifications: { toasts: { addDanger: jest.fn() } },
  edit: false,
  monitor: null,
  isDarkMode: false,
};

describe('ConfigureTriggersPpl', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders empty state when no triggers', () => {
    const { container } = render(
      <Formik initialValues={{ triggerDefinitions: [] }} onSubmit={() => {}}>
        <ConfigureTriggersPpl {...defaultProps} />
      </Formik>
    );
    expect(container).toBeTruthy();
  });

  test('renders with existing triggers', () => {
    const { container } = render(
      <Formik
        initialValues={{
          triggerDefinitions: [
            {
              name: 'T1',
              severity: 'high',
              type: 'number_of_results',
              num_results_condition: '>=',
              num_results_value: 1,
            },
          ],
        }}
        onSubmit={() => {}}
      >
        <ConfigureTriggersPpl {...defaultProps} />
      </Formik>
    );
    expect(container).toBeTruthy();
  });
});

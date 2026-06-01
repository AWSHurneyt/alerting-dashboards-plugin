/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';

jest.mock('../ConfigureActions/ConfigureActionsPpl', () => () => null);
jest.mock('../../components/TriggerGraphPpl', () => () => null);
jest.mock(
  '../../../../components/FeatureAnywhereContextMenu/MinimalAccordion',
  () =>
    ({ children }) =>
      children
);
jest.mock('../../../../utils/validate', () => ({
  isInvalid: jest.fn(() => false),
  hasError: jest.fn(() => false),
}));
jest.mock('./utils/validation', () => ({
  validateTriggerName: jest.fn(),
  validateNumResultsValue: jest.fn(),
}));
jest.mock('../../../../utils/constants', () => ({
  OS_NOTIFICATION_PLUGIN: 'opensearch-notifications',
}));
jest.mock('../../utils/constants', () => ({
  DEFAULT_TRIGGER_NAME: 'New trigger',
}));
jest.mock('../../utils/helper', () => ({
  getTriggerContext: jest.fn(() => ({ monitor: {}, trigger: {} })),
}));

import DefineTriggerPpl from './DefineTriggerPpl';

const defaultProps = {
  httpClient: {
    get: jest.fn().mockResolvedValue({ ok: true }),
    post: jest.fn().mockResolvedValue({ ok: true }),
  },
  monitorValues: { name: 'Test', pplQuery: 'source = idx' },
  plugins: [],
  notifications: { toasts: { addDanger: jest.fn() } },
  triggerIndex: 0,
  triggerValues: {
    name: 'T1',
    severity: 'high',
    type: 'number_of_results',
    num_results_condition: '>=',
    num_results_value: 1,
    actions: [],
  },
  isDarkMode: false,
  setFlyout: jest.fn(),
  response: {},
  fieldPath: 'triggerDefinitions[0].',
  edit: false,
};

describe('DefineTriggerPpl', () => {
  test('renders', () => {
    const { container } = render(
      <Formik
        initialValues={{ triggerDefinitions: [defaultProps.triggerValues] }}
        onSubmit={() => {}}
      >
        <DefineTriggerPpl {...defaultProps} />
      </Formik>
    );
    expect(container).toBeTruthy();
  });

  test('renders in edit mode', () => {
    const { container } = render(
      <Formik
        initialValues={{ triggerDefinitions: [defaultProps.triggerValues] }}
        onSubmit={() => {}}
      >
        <DefineTriggerPpl {...defaultProps} edit={true} />
      </Formik>
    );
    expect(container).toBeTruthy();
  });
});

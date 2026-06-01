/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';

jest.mock('../../../../../components/FormControls', () => ({
  FormikTextArea: () => null,
  FormikFieldRadio: () => null,
  FormikFieldText: () => null,
  FormikCheckbox: () => null,
  FormikFieldNumber: () => null,
}));
jest.mock('../../../../../utils/validate', () => ({
  isInvalid: jest.fn(() => false),
  hasError: jest.fn(() => false),
  required: jest.fn(),
  validateActionThrottle: jest.fn(),
  isInvalidActionThrottle: jest.fn(() => false),
}));
jest.mock('../../../../../../utils/constants', () => ({
  URL: 'https://docs.example.com',
  MAX_THROTTLE_VALUE: 1440,
  WRONG_THROTTLE_WARNING: 'Throttle too high',
}));
jest.mock('../../../../../utils/constants', () => ({
  MONITOR_TYPE: { QUERY_LEVEL: 'monitor' },
}));
jest.mock('../../../../MonitorDetails/components/OverviewStat', () => () => null);

import MessagePpl from './MessagePpl';

const defaultProps = {
  action: {
    name: 'action1',
    destination_id: 'dest-1',
    message_template: { source: 'Alert: {{ctx.monitor.name}}' },
  },
  context: { ctx: { monitor: { name: 'Test' }, trigger: { name: 'T1' } } },
  index: 0,
  sendTestMessage: jest.fn(),
  fieldPath: 'triggerDefinitions[0].actions[0].',
  values: {},
};

describe('MessagePpl', () => {
  test('renders', () => {
    const { container } = render(
      <Formik
        initialValues={{ 'triggerDefinitions[0].actions[0].name': 'action1' }}
        onSubmit={() => {}}
      >
        <MessagePpl {...defaultProps} />
      </Formik>
    );
    expect(container).toBeTruthy();
  });

  test('renders with subject disabled', () => {
    const { container } = render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        <MessagePpl {...defaultProps} isSubjectDisabled />
      </Formik>
    );
    expect(container).toBeTruthy();
  });
});

/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';

jest.mock('../../CreateMonitor/components/VisualGraph/PplAlertingVisualGraph', () => ({
  PplAlertingVisualGraph: () => null,
}));
jest.mock('./TriggerExpressions/TriggerExpressionsPpl', () => () => null);

import TriggerGraphPpl from './TriggerGraphPpl';

const defaultProps = {
  monitorValues: { name: 'Test', pplQuery: 'source = idx' },
  response: { datarows: [[10]], schema: [{ name: 'count', type: 'integer' }] },
  thresholdValue: 100,
  thresholdEnum: '>=',
  fieldPath: 'triggerDefinitions[0].',
  flyoutMode: undefined,
};

describe('TriggerGraphPpl', () => {
  test('renders', () => {
    const { container } = render(
      <Formik initialValues={{ thresholdValue: 100, thresholdEnum: '>=' }} onSubmit={() => {}}>
        <TriggerGraphPpl {...defaultProps} />
      </Formik>
    );
    expect(container).toBeTruthy();
  });

  test('renders with error message', () => {
    const { container } = render(
      <Formik initialValues={{ thresholdValue: 100 }} onSubmit={() => {}}>
        <TriggerGraphPpl {...defaultProps} errorMessage="Query failed" />
      </Formik>
    );
    expect(container).toBeTruthy();
  });

  test('renders in flyout mode', () => {
    const { container } = render(
      <Formik initialValues={{ thresholdValue: 100 }} onSubmit={() => {}}>
        <TriggerGraphPpl {...defaultProps} flyoutMode="create" />
      </Formik>
    );
    expect(container).toBeTruthy();
  });
});

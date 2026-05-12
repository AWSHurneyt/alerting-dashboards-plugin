/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';

import TriggerExpressions from './TriggerExpressions';

const props = {
  thresholdEnum: 'ABOVE',
  thresholdValue: 500,
};

describe('TriggerExpressions', () => {
  test('renders', () => {
    const { container } = render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        <TriggerExpressions {...props} />
      </Formik>
    );
    expect(container).toMatchSnapshot();
  });
});

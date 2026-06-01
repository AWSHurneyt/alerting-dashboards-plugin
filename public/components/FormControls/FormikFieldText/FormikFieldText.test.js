/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';

import FormikFieldText from './FormikFieldText';

describe('FormikFieldText', () => {
  test('renders', () => {
    const component = (
      <Formik>
        <FormikFieldText name="testing" />
      </Formik>
    );

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';

import FormikTextArea from './FormikTextArea';

describe('FormikTextArea', () => {
  test('renders', () => {
    const component = (
      <Formik>
        <FormikTextArea name="testing" />
      </Formik>
    );

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

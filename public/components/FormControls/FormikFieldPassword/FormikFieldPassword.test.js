/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';

import FormikFieldPassword from './FormikFieldPassword';

describe('FormikFieldPassword', () => {
  test('renders', () => {
    const component = (
      <Formik>
        <FormikFieldPassword name="testing" />
      </Formik>
    );

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

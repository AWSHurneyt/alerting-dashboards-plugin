/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';

import FormikSelect from './FormikSelect';

describe('FormikSelect', () => {
  test('renders', () => {
    const component = (
      <Formik>
        <FormikSelect name="testing" inputProps={{ options: [{ value: 'test', text: 'test' }] }} />
      </Formik>
    );

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

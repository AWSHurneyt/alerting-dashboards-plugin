/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';

import FormikInputWrapper from './FormikInputWrapper';

describe('FormikInputWrapper', () => {
  test('renders', () => {
    const component = (
      <Formik>
        <FormikInputWrapper name="testing" fieldProps={{}} render={() => <div>test</div>} />
      </Formik>
    );

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

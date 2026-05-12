/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';

import FormikComboBox from './FormikComboBox';

describe('FormikComboBox', () => {
  test('renders', () => {
    const component = (
      <Formik initialValues={{ testing: [] }} onSubmit={() => {}}>
        <FormikComboBox name="testing" />
      </Formik>
    );

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

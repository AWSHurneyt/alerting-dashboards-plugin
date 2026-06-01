/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';

import FormikCheckableCard from './FormikCheckableCard';

describe('FormikCheckableCard', () => {
  test('render formRow', () => {
    const component = (
      <Formik>
        <FormikCheckableCard name="testing" formRow />
      </Formik>
    );

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });

  test('render', () => {
    const component = (
      <Formik>
        <FormikCheckableCard name="testing" />
      </Formik>
    );

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

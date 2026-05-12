/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';

import FormikCodeEditor from './FormikCodeEditor';
import FormikCheckableCard from '../FormikCheckableCard';

// FIXME: This has an issue where EuiCodeEditor is generating a random HTML id and failing snapshot test

describe('FormikCodeEditor', () => {
  test('render formRow', () => {
    const component = (
      <Formik>
        <FormikCodeEditor name="testing" formRow />
      </Formik>
    );

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
  test('renders', () => {
    const component = (
      <Formik>
        <FormikCodeEditor name="testing" />
      </Formik>
    );

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

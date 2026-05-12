/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';
import FindingsPopover from './FindingsPopover';

describe('FindingsPopover', () => {
  test('renders', () => {
    const component = (
      <Formik>
        <FindingsPopover />
      </Formik>
    );
    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

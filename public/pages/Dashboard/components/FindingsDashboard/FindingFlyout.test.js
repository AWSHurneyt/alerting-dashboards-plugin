/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';
import FindingFlyout from './FindingFlyout';

describe('FindingFlyout', () => {
  test('renders', () => {
    const component = (
      <Formik>
        <FindingFlyout />
      </Formik>
    );
    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

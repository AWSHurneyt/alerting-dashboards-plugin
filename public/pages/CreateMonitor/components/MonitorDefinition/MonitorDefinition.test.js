/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';

import MonitorDefinition from './MonitorDefinition';

describe('MonitorDefinition', () => {
  test('renders', () => {
    const component = (
      <Formik>
        <MonitorDefinition resetResponse={() => {}} />
      </Formik>
    );
    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

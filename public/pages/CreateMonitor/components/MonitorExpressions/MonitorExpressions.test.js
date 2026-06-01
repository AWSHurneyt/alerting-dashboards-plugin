/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Formik } from 'formik';
import { render } from '@testing-library/react';

import { FORMIK_INITIAL_VALUES } from '../../containers/CreateMonitor/utils/constants';
import MonitorExpressions from './MonitorExpressions';

describe('MonitorExpressions', () => {
  test('renders', () => {
    const component = (
      <Formik initialValues={FORMIK_INITIAL_VALUES}>
        {() => <MonitorExpressions onRunQuery={() => {}} dataTypes={[]} errors={{}} />}
      </Formik>
    );

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

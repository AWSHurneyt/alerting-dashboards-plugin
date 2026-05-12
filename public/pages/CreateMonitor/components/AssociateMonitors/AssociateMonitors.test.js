/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import AssociateMonitors from './AssociateMonitors';
import { Formik } from 'formik';
import { FORMIK_INITIAL_VALUES } from '../../containers/CreateMonitor/utils/constants';

describe('AssociateMonitors', () => {
  test('renders', () => {
    const component = (
      <Formik initialValues={FORMIK_INITIAL_VALUES} onSubmit={() => {}}>
        <AssociateMonitors isDarkMode={false} values={{}} httpClient={{}} errors={{}} />
      </Formik>
    );
    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

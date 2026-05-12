/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import MonitorDefinitionCard from './MonitorDefinitionCard';
import { Formik } from 'formik';
import { FORMIK_INITIAL_VALUES } from '../../containers/CreateMonitor/utils/constants';
import { OS_AD_PLUGIN } from '../../../../utils/constants';

describe('MonitorDefinitionCard', () => {
  test('renders without AD plugin', () => {
    const component = (
      <Formik initialValues={FORMIK_INITIAL_VALUES}>
        {() => <MonitorDefinitionCard values={{}} plugins={[]} />}
      </Formik>
    );

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
  test('renders without AD plugin', () => {
    const component = (
      <Formik initialValues={FORMIK_INITIAL_VALUES}>
        {() => <MonitorDefinitionCard values={{}} plugins={[OS_AD_PLUGIN]} />}
      </Formik>
    );

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

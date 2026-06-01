/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import MonitorType from './MonitorType';
import { Formik } from 'formik';
import { FORMIK_INITIAL_VALUES } from '../../containers/CreateMonitor/utils/constants';

jest.mock('../../../../services/services', () => ({
  ...jest.requireActual('../../../../services/services'),
  isPplAlertingEnabled: jest.fn(() => false),
}));

describe('MonitorType', () => {
  test('renders', () => {
    const component = (
      <Formik initialValues={FORMIK_INITIAL_VALUES}>{() => <MonitorType values={{}} />}</Formik>
    );

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

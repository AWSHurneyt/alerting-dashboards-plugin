/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Formik } from 'formik';
import { render } from '@testing-library/react';

import { FORMIK_INITIAL_VALUES } from '../../../containers/CreateMonitor/utils/constants';
import Frequency from './Frequency';
import Interval from './Interval';
import Monthly from './Monthly';
import CustomCron from './CustomCron';
import FrequencyPicker from './FrequencyPicker';

describe('Frequencies', () => {
  test('renders Frequency', () => {
    const component = <Formik initialValues={FORMIK_INITIAL_VALUES} render={() => <Frequency />} />;

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });

  test('renders Interval', () => {
    const component = <Formik initialValues={FORMIK_INITIAL_VALUES} render={() => <Interval />} />;

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });

  test('renders Monthly', () => {
    const component = <Formik initialValues={FORMIK_INITIAL_VALUES} render={() => <Monthly />} />;

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });

  test('renders CustomCron', () => {
    const component = (
      <Formik initialValues={FORMIK_INITIAL_VALUES} render={() => <CustomCron />} />
    );

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });

  test('renders FrequencyPicker', () => {
    const component = (
      <Formik initialValues={FORMIK_INITIAL_VALUES} render={() => <FrequencyPicker />} />
    );

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

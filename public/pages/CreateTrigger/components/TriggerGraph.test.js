/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';
import TriggerGraph from './TriggerGraph';
import { FORMIK_INITIAL_VALUES } from '../../CreateMonitor/containers/CreateMonitor/utils/constants';

describe('TriggerGraph', () => {
  test('renders', () => {
    const { container } = render(
      <Formik initialValues={FORMIK_INITIAL_VALUES} onSubmit={() => {}}>
        <TriggerGraph monitorValues={FORMIK_INITIAL_VALUES} fieldPath="" />
      </Formik>
    );
    expect(container).toMatchSnapshot();
  });
});

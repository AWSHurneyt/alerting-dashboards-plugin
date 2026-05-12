/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import { Formik } from 'formik';
import { FORMIK_INITIAL_VALUES } from '../../../containers/CreateMonitor/utils/constants';
import MonitorsList from './MonitorsList';

describe('MonitorsList', () => {
  test('renders', () => {
    const component = (
      <Formik initialValues={FORMIK_INITIAL_VALUES} onSubmit={() => {}}>
        <MonitorsList
          values={{}}
          httpClient={{ get: jest.fn().mockResolvedValue({ ok: true, monitors: [] }) }}
        />
      </Formik>
    );
    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

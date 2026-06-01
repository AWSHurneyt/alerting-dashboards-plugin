/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';

import MonitorTimeField from './MonitorTimeField';

describe('MonitorTimeField', () => {
  test('renders', () => {
    const { container } = render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        <MonitorTimeField dataTypes={{}} />
      </Formik>
    );
    expect(container).toMatchSnapshot();
  });

  test('displays no options when no date fields', () => {
    const { container } = render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        <MonitorTimeField dataTypes={{}} />
      </Formik>
    );
    // No option pills should be rendered
    expect(container.querySelectorAll('.euiComboBoxPill')).toHaveLength(0);
  });

  test('displays options', () => {
    const { container } = render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        <MonitorTimeField dataTypes={{ date: ['date1', 'date2', 'date3'] }} />
      </Formik>
    );
    expect(container).toMatchSnapshot();
  });

  test('displays options includes date_nanos', () => {
    const { container } = render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        <MonitorTimeField
          dataTypes={{ date: ['date1', 'date2', 'date3'], date_nanos: ['date_nanos1'] }}
        />
      </Formik>
    );
    expect(container).toMatchSnapshot();
  });
});

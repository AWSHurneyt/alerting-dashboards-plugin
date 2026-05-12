/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import ExtractionQuery from './ExtractionQuery';
import { Formik } from 'formik';
import { FORMIK_INITIAL_VALUES } from '../../containers/CreateMonitor/utils/constants';

describe('ExtractionQuery', () => {
  test('renders', () => {
    const component = (
      <Formik initialValues={FORMIK_INITIAL_VALUES}>
        {() => <ExtractionQuery response={JSON.stringify({ hits: 10 })} />}
      </Formik>
    );

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

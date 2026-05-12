/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';

import { httpClientMock } from '../../../../../test/mocks';
import DataSource from './DataSource';
import { FORMIK_INITIAL_VALUES } from '../CreateMonitor/utils/constants';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('DataSource', () => {
  test('renders', () => {
    const { container } = render(
      <Formik initialValues={FORMIK_INITIAL_VALUES} onSubmit={() => {}}>
        <DataSource
          values={FORMIK_INITIAL_VALUES}
          httpClient={httpClientMock}
          dataTypes={{ date: [], date_nanos: [] }}
        />
      </Formik>
    );
    expect(container).toMatchSnapshot();
  });
});

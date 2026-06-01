/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';

import DefineMonitor from './DefineMonitor';
import { FORMIK_INITIAL_VALUES } from '../CreateMonitor/utils/constants';
import { httpClientMock } from '../../../../../test/mocks';
import { setupCoreStart } from '../../../../../test/utils/helpers';

beforeAll(() => {
  setupCoreStart();
});

describe('DefineMonitor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    httpClientMock.post.mockResolvedValue({ ok: true, resp: [] });
    httpClientMock.get.mockResolvedValue({ ok: true, resp: [] });
  });

  test('renders', () => {
    const { container } = render(
      <Formik initialValues={FORMIK_INITIAL_VALUES} onSubmit={() => {}}>
        <DefineMonitor
          values={FORMIK_INITIAL_VALUES}
          errors={{}}
          touched={{}}
          httpClient={httpClientMock}
          notifications={{ toasts: { addDanger: jest.fn() } }}
          location={{ pathname: '/create-monitor', search: '' }}
        />
      </Formik>
    );
    expect(container).toMatchSnapshot();
  });
});

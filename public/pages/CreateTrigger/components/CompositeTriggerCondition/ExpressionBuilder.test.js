/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';
import { FORMIK_INITIAL_VALUES } from '../../../CreateMonitor/containers/CreateMonitor/utils/constants';

// Mock the heavy AssociateMonitors import that causes OOM
jest.mock('../../../CreateMonitor/components/AssociateMonitors/AssociateMonitors', () => ({
  getMonitors: jest.fn().mockResolvedValue([]),
  __esModule: true,
  default: () => <div />,
}));

import ExpressionBuilder from './ExpressionBuilder';

describe('ExpressionBuilder', () => {
  test('renders', () => {
    const { container } = render(
      <Formik initialValues={FORMIK_INITIAL_VALUES} onSubmit={() => {}}>
        <ExpressionBuilder
          formikFieldPath={'path'}
          formikFieldName={'triggerCondition'}
          values={{ associatedMonitors: { sequence: { delegates: [] } } }}
          touched={{}}
          httpClient={{ get: jest.fn().mockResolvedValue({ ok: true, monitors: [] }) }}
        />
      </Formik>
    );
    expect(container).toMatchSnapshot();
  });
});

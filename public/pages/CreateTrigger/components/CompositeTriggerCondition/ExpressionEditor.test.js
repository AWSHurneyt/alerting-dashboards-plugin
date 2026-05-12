/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import { Formik } from 'formik';
import { FORMIK_INITIAL_VALUES } from '../../../CreateMonitor/containers/CreateMonitor/utils/constants';
import ExpressionEditor from './ExpressionEditor';

describe('ExpressionEditor', () => {
  test('renders', () => {
    const component = (
      <Formik initialValues={FORMIK_INITIAL_VALUES} onSubmit={() => {}}>
        <ExpressionEditor
          formikFieldPath={'path'}
          formikFieldName={'triggerCondition'}
          values={{}}
          isDarkMode={false}
        />
      </Formik>
    );
    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

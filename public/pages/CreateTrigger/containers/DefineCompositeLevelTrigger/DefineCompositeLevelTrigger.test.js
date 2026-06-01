/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import { Formik } from 'formik';
import { FORMIK_INITIAL_VALUES } from '../../../CreateMonitor/containers/CreateMonitor/utils/constants';
import DefineCompositeLevelTrigger from './DefineCompositeLevelTrigger';

describe('DefineCompositeLevelTrigger', () => {
  test('renders', () => {
    const component = (
      <Formik initialValues={FORMIK_INITIAL_VALUES} onSubmit={() => {}}>
        <DefineCompositeLevelTrigger
          isDarkMode={false}
          httpClient={{ get: jest.fn().mockResolvedValue({ ok: true, monitors: [] }) }}
          notifications={{ toasts: { addDanger: jest.fn() } }}
          notificationService={{}}
          plugins={[]}
          values={{}}
          touched={{}}
        />
      </Formik>
    );
    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

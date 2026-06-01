/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import { Formik } from 'formik';
import { FORMIK_INITIAL_VALUES } from '../../../CreateMonitor/containers/CreateMonitor/utils/constants';
import TriggerNotifications from './TriggerNotifications';

describe('TriggerNotifications', () => {
  test('renders', () => {
    const component = (
      <Formik initialValues={FORMIK_INITIAL_VALUES} onSubmit={() => {}}>
        <TriggerNotifications
          httpClient={{ get: jest.fn().mockResolvedValue({ ok: true }) }}
          triggerActions={[]}
          plugins={[]}
          notifications={{ toasts: { addDanger: jest.fn() } }}
          notificationService={{}}
          triggerValues={FORMIK_INITIAL_VALUES}
        />
      </Formik>
    );
    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import { Formik } from 'formik';
import { FORMIK_INITIAL_VALUES } from '../../../CreateMonitor/containers/CreateMonitor/utils/constants';
import TriggerNotificationsContent from './TriggerNotificationsContent';

describe('TriggerNotificationsContent', () => {
  test('renders without notifications', () => {
    const component = (
      <Formik initialValues={FORMIK_INITIAL_VALUES} onSubmit={() => {}}>
        <TriggerNotificationsContent
          action={{}}
          options={[]}
          actionIndex={0}
          triggerValues={FORMIK_INITIAL_VALUES}
          httpClient={{}}
          notifications={{}}
          hasNotifications={false}
        />
      </Formik>
    );
    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
  test('renders with notifications', () => {
    const component = (
      <Formik initialValues={FORMIK_INITIAL_VALUES} onSubmit={() => {}}>
        <TriggerNotificationsContent
          action={{}}
          options={[]}
          actionIndex={0}
          triggerValues={FORMIK_INITIAL_VALUES}
          httpClient={{}}
          notifications={{}}
          hasNotifications={true}
        />
      </Formik>
    );
    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

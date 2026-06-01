/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import NotificationsInfoCallOut from './NotificationsInfoCallOut';
import { setupCoreStart } from '../../../../../test/utils/helpers';

beforeAll(() => {
  setupCoreStart();
});

describe('NotificationsInfoCallOut', () => {
  test('renders when Notifications plugin is installed', () => {
    const component = <NotificationsInfoCallOut hasNotificationPlugin={true} />;

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
  test('renders when Notifications plugin is not installed', () => {
    const component = <NotificationsInfoCallOut hasNotificationPlugin={false} />;

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import NotificationsCallOut from './NotificationsCallOut';

describe('NotifictionsCallOut', () => {
  test('renders', () => {
    const component = <NotificationsCallOut />;

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

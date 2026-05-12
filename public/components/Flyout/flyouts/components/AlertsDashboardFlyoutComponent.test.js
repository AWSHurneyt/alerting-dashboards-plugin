/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import AlertsDashboardFlyoutComponent from './AlertsDashboardFlyoutComponent';
import { historyMock, httpClientMock } from '../../../../../test/mocks';

describe('AlertsDashboardFlyoutComponent', () => {
  test('renders', () => {
    httpClientMock.get.mockResolvedValue({ ok: true, resp: { name: 'random_name' } });
    const { container } = render(
      <AlertsDashboardFlyoutComponent
        location={{ pathname: '/dashboard', search: '' }}
        flyout={{ type: 'message', payload: null }}
        onClose={jest.fn()}
        history={historyMock}
        httpClient={httpClientMock}
      />
    );
    expect(container).toMatchSnapshot();
  });
});

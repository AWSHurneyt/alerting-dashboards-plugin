/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { httpServiceMock } from '../../../../../../../src/core/public/mocks';

import CreateMonitor from './CreateMonitor';
import { historyMock, httpClientMock } from '../../../../../test/mocks';
import { setupCoreStart } from '../../../../../test/utils/helpers';
import { setClient, setNotifications } from '../../../../services';
import coreMock from '../../../../../test/mocks/CoreMock';

const setFlyout = jest.fn();
const match = {
  isExact: true,
  params: {},
  path: '/create-monitor',
  url: '/create-monitor',
};
const location = {
  hash: '',
  pathname: '/create-monitor',
  search: '',
  state: undefined,
};

beforeAll(() => {
  setupCoreStart();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CreateMonitor', () => {
  const httpClient = httpServiceMock.createStartContract();
  setClient(httpClient);
  setNotifications(coreMock.notifications);

  test('renders', () => {
    const { container } = render(
      <CreateMonitor
        httpClient={httpClientMock}
        history={historyMock}
        setFlyout={setFlyout}
        match={match}
        location={location}
      />
    );
    expect(container).toMatchSnapshot();
  });
});

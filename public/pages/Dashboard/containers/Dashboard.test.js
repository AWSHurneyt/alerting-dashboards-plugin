/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

jest.mock('../../../services', () => {
  const services = jest.requireActual('../../../services/services');
  return {
    ...services,
    NotificationService: function NotificationServiceMock() {},
    getUseUpdatedUx: jest.fn(() => false),
  };
});

jest.mock('../../utils/helpers', () => {
  const helpers = jest.requireActual('../../utils/helpers');
  return {
    ...helpers,
    getIsAgentConfigured: jest.fn().mockResolvedValue(false),
  };
});

import Dashboard from './Dashboard';
import { historyMock, httpClientMock } from '../../../../test/mocks';
import { setupCoreStart } from '../../../../test/utils/helpers';

const location = {
  hash: '',
  search: '',
  state: undefined,
};

beforeAll(() => {
  setupCoreStart();
});

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    httpClientMock.get.mockResolvedValue({
      ok: true,
      alerts: [],
      totalAlerts: 0,
      resp: { totalAlerts: 0, alerts: [] },
    });
  });

  test('renders', () => {
    const { container } = render(
      <Dashboard httpClient={httpClientMock} history={historyMock} location={location} />
    );
    expect(container).toMatchSnapshot();
  });
});

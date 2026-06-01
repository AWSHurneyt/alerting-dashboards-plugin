/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';

import DestinationsList from './DestinationsList';
import { historyMock, httpClientMock } from '../../../../../test/mocks';
import { DESTINATION_TYPE } from '../../utils/constants';
import { OS_NOTIFICATION_PLUGIN } from '../../../../utils/constants';
import { setupCoreStart } from '../../../../../test/utils/helpers';

const location = {
  hash: '',
  search: '',
  state: undefined,
};

beforeAll(() => {
  setupCoreStart();
});

const mockSettings = {
  defaults: {
    plugins: {
      alerting: {
        destination: {
          allow_list: Object.values(DESTINATION_TYPE),
        },
      },
    },
  },
};

describe('DestinationsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders when Notification plugin is installed', async () => {
    httpClientMock.get
      .mockResolvedValueOnce({ ok: true, resp: { component: OS_NOTIFICATION_PLUGIN } })
      .mockResolvedValueOnce({ ok: true, resp: mockSettings })
      .mockResolvedValue({ ok: true, destinations: [], totalDestinations: 0 });

    const { container } = render(
      <DestinationsList httpClient={httpClientMock} history={historyMock} location={location} />
    );

    await waitFor(() => {
      expect(httpClientMock.get).toHaveBeenCalled();
    });
    expect(container).toMatchSnapshot();
  });

  test('renders when Notification plugin is not installed', async () => {
    httpClientMock.get
      .mockResolvedValueOnce({ ok: true, resp: mockSettings })
      .mockResolvedValue({ ok: true, destinations: [], totalDestinations: 0 });

    const { container } = render(
      <DestinationsList httpClient={httpClientMock} history={historyMock} location={location} />
    );

    await waitFor(() => {
      expect(httpClientMock.get).toHaveBeenCalled();
    });
    expect(container).toMatchSnapshot();
  });

  test('renders when email is disallowed', async () => {
    const noEmailSettings = {
      defaults: {
        plugins: {
          alerting: { destination: { allow_list: ['chime', 'slack', 'custom_webhook'] } },
        },
      },
    };

    httpClientMock.get
      .mockResolvedValueOnce({ ok: true, resp: { component: OS_NOTIFICATION_PLUGIN } })
      .mockResolvedValueOnce({ ok: true, resp: noEmailSettings })
      .mockResolvedValue({ ok: true, destinations: [], totalDestinations: 0 });

    const { container } = render(
      <DestinationsList httpClient={httpClientMock} history={historyMock} location={location} />
    );

    await waitFor(() => {
      expect(httpClientMock.get).toHaveBeenCalled();
    });
    expect(container).toMatchSnapshot();
  });

  test('getDestinations', async () => {
    const mockDestination = {
      id: 'id',
      type: 'test_action',
      name: 'destName',
      schema_version: 1,
      seq_no: 2,
      primary_term: 3,
      test_action: 'dummy',
    };

    httpClientMock.get
      .mockResolvedValueOnce({ ok: true, resp: { component: OS_NOTIFICATION_PLUGIN } })
      .mockResolvedValueOnce({ ok: true, resp: mockSettings })
      .mockResolvedValue({ ok: true, destinations: [mockDestination], totalDestinations: 1 });

    const { container } = render(
      <DestinationsList httpClient={httpClientMock} history={historyMock} location={location} />
    );

    await waitFor(() => {
      expect(container.textContent).toContain('destName');
    });
  });
});

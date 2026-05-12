/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';

import ManageSenders from './ManageSenders';
import { httpClientMock } from '../../../../../../test/mocks';

const onClickCancel = jest.fn();
const onClickSave = jest.fn();

describe('ManageSenders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    httpClientMock.get.mockResolvedValue({ ok: true, emailAccounts: [] });
  });

  test('renders', () => {
    const { container } = render(
      <ManageSenders
        httpClient={httpClientMock}
        isEmailAllowed={true}
        isVisible={false}
        onClickCancel={onClickCancel}
        onClickSave={onClickSave}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('renders when visible', () => {
    const { container } = render(
      <ManageSenders
        httpClient={httpClientMock}
        isEmailAllowed={true}
        isVisible={true}
        onClickCancel={onClickCancel}
        onClickSave={onClickSave}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('renders when email is disallowed', () => {
    const { container } = render(
      <ManageSenders
        httpClient={httpClientMock}
        isEmailAllowed={false}
        isVisible={true}
        onClickCancel={onClickCancel}
        onClickSave={onClickSave}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('loadInitialValues', async () => {
    httpClientMock.get.mockResolvedValue({
      ok: true,
      emailAccounts: [{ id: 'id', name: 'test_sender', email: 'test@email.com' }],
    });

    render(
      <ManageSenders
        httpClient={httpClientMock}
        isEmailAllowed={true}
        isVisible={true}
        onClickCancel={onClickCancel}
        onClickSave={onClickSave}
      />
    );

    await waitFor(() => {
      expect(httpClientMock.get).toHaveBeenCalled();
    });
  });

  test('getSenders logs resp.err when ok:false', async () => {
    const log = jest.spyOn(global.console, 'log');
    httpClientMock.get.mockResolvedValue({
      ok: false,
      err: 'test',
    });

    render(
      <ManageSenders
        httpClient={httpClientMock}
        isEmailAllowed={true}
        isVisible={true}
        onClickCancel={onClickCancel}
        onClickSave={onClickSave}
      />
    );

    await waitFor(() => {
      expect(log).toHaveBeenCalledWith('Unable to get email accounts', 'test');
    });
  });

  test('loads empty list of senders when ok:false', async () => {
    httpClientMock.get.mockResolvedValue({
      ok: false,
      err: 'test',
    });

    render(
      <ManageSenders
        httpClient={httpClientMock}
        isEmailAllowed={true}
        isVisible={true}
        onClickCancel={onClickCancel}
        onClickSave={onClickSave}
      />
    );

    await waitFor(() => {
      expect(httpClientMock.get).toHaveBeenCalled();
    });
  });
});

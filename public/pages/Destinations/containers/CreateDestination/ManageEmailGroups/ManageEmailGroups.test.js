/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';

import ManageEmailGroups from './ManageEmailGroups';
import { httpClientMock } from '../../../../../../test/mocks';

const onClickCancel = jest.fn();
const onClickSave = jest.fn();

describe('ManageEmailGroups', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    httpClientMock.get.mockResolvedValue({ ok: true, emailGroups: [] });
  });

  test('renders', () => {
    const { container } = render(
      <ManageEmailGroups
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
      <ManageEmailGroups
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
      <ManageEmailGroups
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
    const mockEmailGroup = {
      id: 'id',
      name: 'test_group',
      emails: [{ email: 'test@email.com' }],
    };
    httpClientMock.get.mockResolvedValue({
      ok: true,
      emailGroups: [mockEmailGroup],
    });

    const { container } = render(
      <ManageEmailGroups
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

  test('getEmailGroups logs resp.err when ok:false', async () => {
    const log = jest.spyOn(global.console, 'log');
    httpClientMock.get.mockResolvedValue({
      ok: false,
      err: 'test',
    });

    render(
      <ManageEmailGroups
        httpClient={httpClientMock}
        isEmailAllowed={true}
        isVisible={true}
        onClickCancel={onClickCancel}
        onClickSave={onClickSave}
      />
    );

    await waitFor(() => {
      expect(log).toHaveBeenCalledWith('Unable to get email groups', 'test');
    });
  });

  test('loads empty list of email groups when ok:false', async () => {
    httpClientMock.get.mockResolvedValue({
      ok: false,
      err: 'test',
    });

    const { container } = render(
      <ManageEmailGroups
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

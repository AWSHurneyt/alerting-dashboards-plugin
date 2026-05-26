/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { renderHook, waitFor } from '@testing-library/react';

jest.mock('../utils/constants', () => ({
  MAX_CHANNELS_RESULT_SIZE: 50,
}));
jest.mock('../pages/utils/helpers', () => ({
  getDataSourceQueryObj: jest.fn(() => null),
}));

import { useChannels } from './useChannels';

describe('useChannels', () => {
  test('loads channels on mount', async () => {
    const httpClient = {
      get: jest.fn().mockResolvedValue({ ok: true, channel_list: [{ id: 'ch-1', name: 'Slack' }] }),
    };
    const { result } = renderHook(() => useChannels(httpClient));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.channels).toEqual([{ id: 'ch-1', name: 'Slack' }]);
  });

  test('handles error', async () => {
    const httpClient = { get: jest.fn().mockRejectedValue(new Error('network')) };
    const { result } = renderHook(() => useChannels(httpClient));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe('network');
    expect(result.current.channels).toEqual([]);
  });
});

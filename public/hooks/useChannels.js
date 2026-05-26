/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { MAX_CHANNELS_RESULT_SIZE } from '../utils/constants';
import { getDataSourceQueryObj } from '../pages/utils/helpers';

/**
 * Hook that loads notification channels from the backend.
 * Handles pagination internally to fetch all channels.
 *
 * @param {object} httpClient - The HTTP client for API calls
 * @returns {{ channels: Array, loading: boolean, error: string|null, reload: function }}
 */
export const useChannels = (httpClient) => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadChannels = useCallback(async () => {
    if (!httpClient) return;
    setLoading(true);
    setError(null);

    try {
      const dataSourceQuery = getDataSourceQueryObj();
      let allChannels = [];
      let startIndex = 0;
      let hasMore = true;

      while (hasMore) {
        const resp = await httpClient.get('../api/alerting/channels', {
          query: {
            ...(dataSourceQuery?.query || {}),
            startIndex,
            maxItems: MAX_CHANNELS_RESULT_SIZE,
          },
        });

        if (resp.ok) {
          const items = resp.channel_list || [];
          allChannels = allChannels.concat(items);
          startIndex += items.length;
          hasMore = items.length === MAX_CHANNELS_RESULT_SIZE;
        } else {
          hasMore = false;
        }
      }

      setChannels(allChannels);
    } catch (err) {
      setError(err?.message || 'Failed to load channels');
      setChannels([]);
    } finally {
      setLoading(false);
    }
  }, [httpClient]);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  return { channels, loading, error, reload: loadChannels };
};

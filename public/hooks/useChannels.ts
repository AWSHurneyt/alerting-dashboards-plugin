/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { MAX_CHANNELS_RESULT_SIZE } from '../utils/constants';
import { getDataSourceQueryObj } from '../pages/utils/helpers';

interface Channel {
  config_id: string;
  name: string;
  config_type: string;
  is_enabled: boolean;
}

interface HttpClient {
  get: (url: string, options?: any) => Promise<any>;
}

interface UseChannelsResult {
  channels: Channel[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/**
 * Hook that loads notification channels from the backend.
 */
export const useChannels = (httpClient: HttpClient | null): UseChannelsResult => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChannels = useCallback(async () => {
    if (!httpClient) return;
    setLoading(true);
    setError(null);

    try {
      const dataSourceQuery = getDataSourceQueryObj();
      let allChannels: Channel[] = [];
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
    } catch (err: any) {
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

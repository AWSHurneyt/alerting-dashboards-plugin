/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { dataSourceEnabled, getDataSourceId, getDataSourceQueryObj } from '../pages/utils/helpers';

/**
 * Hook that encapsulates data source query logic.
 * Returns the current dataSourceId and a query object suitable for API calls.
 *
 * @param {string} [fallbackDataSourceId] - Optional fallback data source ID
 * @returns {{ dataSourceId: string|undefined, dataSourceQuery: object|undefined, isDataSourceEnabled: boolean }}
 */
export const useDataSource = (fallbackDataSourceId) => {
  const isEnabled = dataSourceEnabled();
  const dataSourceId = isEnabled ? getDataSourceId(fallbackDataSourceId) : undefined;
  const dataSourceQuery = useMemo(
    () => getDataSourceQueryObj(fallbackDataSourceId),
    [fallbackDataSourceId]
  );

  return { dataSourceId, dataSourceQuery, isDataSourceEnabled: !!isEnabled };
};

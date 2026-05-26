/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { renderHook } from '@testing-library/react';

jest.mock('../pages/utils/helpers', () => ({
  dataSourceEnabled: jest.fn(() => false),
  getDataSourceId: jest.fn(() => 'ds-1'),
  getDataSourceQueryObj: jest.fn(() => ({ query: { dataSourceId: 'ds-1' } })),
}));

import { useDataSource } from './useDataSource';
import { dataSourceEnabled } from '../pages/utils/helpers';

describe('useDataSource', () => {
  test('returns undefined when data source disabled', () => {
    dataSourceEnabled.mockReturnValue(false);
    const { result } = renderHook(() => useDataSource());
    expect(result.current.isDataSourceEnabled).toBe(false);
    expect(result.current.dataSourceId).toBeUndefined();
  });

  test('returns dataSourceId when enabled', () => {
    dataSourceEnabled.mockReturnValue(true);
    const { result } = renderHook(() => useDataSource());
    expect(result.current.isDataSourceEnabled).toBe(true);
    expect(result.current.dataSourceId).toBe('ds-1');
    expect(result.current.dataSourceQuery).toEqual({ query: { dataSourceId: 'ds-1' } });
  });
});

/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

jest.mock('./getScheduleFromPplMonitor', () => jest.fn(() => 'Every 1 minute'));
jest.mock('../../../../../utils/constants', () => ({ DEFAULT_EMPTY_DATA: '-' }));
jest.mock('../../../../CreateMonitor/containers/CreateMonitor/utils/pplAlertingHelpers', () => ({
  formatDuration: jest.fn((m) => (m ? `${m} min` : '-')),
}));

import getOverviewStatsV2 from './getOverviewStatsV2';

describe('getOverviewStatsV2', () => {
  test('returns firstRow and secondRow', () => {
    const monitor = {
      last_update_time: '2024-01-15T12:00:00Z',
      description: 'Test desc',
      look_back_window_minutes: 60,
    };
    const result = getOverviewStatsV2(monitor, 'mon-1', 3);
    expect(result.firstRow).toHaveLength(5);
    expect(result.secondRow).toHaveLength(1);
    expect(result.firstRow[0].value).toBe(3);
    expect(result.firstRow[1].value).toBe('Every 1 minute');
    expect(result.firstRow[2].value).toBe('60 min');
    expect(result.firstRow[4].value).toBe('mon-1');
    expect(result.secondRow[0].value).toBe('Test desc');
  });

  test('handles missing description', () => {
    const result = getOverviewStatsV2({ last_update_time: null }, 'mon-1', 0);
    expect(result.secondRow[0].value).toBe('-');
  });

  test('handles missing last_update_time', () => {
    const result = getOverviewStatsV2({}, 'mon-1', 0);
    expect(result.firstRow[3].value).toBe('-');
  });
});

/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

jest.mock('./constants', () => ({
  weekdays: [
    { abbr: 'mon', full: 'Monday' },
    { abbr: 'tue', full: 'Tuesday' },
    { abbr: 'wed', full: 'Wednesday' },
  ],
}));
jest.mock('../../../../../utils/constants', () => ({ DEFAULT_EMPTY_DATA: '-' }));

import getScheduleFromPplMonitor from './getScheduleFromPplMonitor';

describe('getScheduleFromPplMonitor', () => {
  test('formats interval schedule', () => {
    const monitor = {
      schedule: { frequency: 'interval', period: { interval: 5, unit: 'MINUTES' } },
    };
    expect(getScheduleFromPplMonitor(monitor)).toBe('Every 5 minutes');
  });

  test('formats cron schedule as fallback', () => {
    const monitor = { schedule: { cron: { expression: '0 */5 * * *', timezone: 'UTC' } } };
    expect(getScheduleFromPplMonitor(monitor)).toBe('0 */5 * * * UTC');
  });

  test('formats cronExpression frequency', () => {
    const monitor = { schedule: { frequency: 'cronExpression', cronExpression: '0 0 * * *' } };
    expect(getScheduleFromPplMonitor(monitor)).toBe('0 0 * * *');
  });

  test('returns default for empty monitor', () => {
    expect(getScheduleFromPplMonitor({})).toBe('-');
    expect(getScheduleFromPplMonitor()).toBe('-');
  });

  test('formats period fallback when no frequency', () => {
    const monitor = { schedule: { period: { interval: 10, unit: 'MINUTES' } } };
    expect(getScheduleFromPplMonitor(monitor)).toBe('Every 10 minutes');
  });
});

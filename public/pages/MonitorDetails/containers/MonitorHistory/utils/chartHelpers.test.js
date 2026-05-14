/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

jest.mock('../../../../../utils/constants', () => ({
  ALERT_STATE: {
    ACTIVE: 'ACTIVE',
    ACKNOWLEDGED: 'ACKNOWLEDGED',
    COMPLETED: 'COMPLETED',
    ERROR: 'ERROR',
  },
}));
jest.mock('./constants', () => ({
  EMPTY_ALERT_COUNT: { ACTIVE: 0, ACKNOWLEDGED: 0, COMPLETED: 0, ERROR: 0 },
  TIME_SERIES_ALERT_STATE: {
    NO_ALERTS: 'NO_ALERTS',
    TRIGGERED: 'TRIGGERED',
    ACKNOWLEDGED: 'ACKNOWLEDGED',
    ERROR: 'ERROR',
  },
}));

import { dataPointsGenerator } from './chartHelpers';

describe('chartHelpers', () => {
  describe('dataPointsGenerator', () => {
    test('generates triggered data point', () => {
      const result = dataPointsGenerator({
        startTime: 1000,
        acknowledgedTime: null,
        endTime: 2000,
        lastEndTime: null,
        windowEndTime: 3000,
        meta: { id: 'alert-1' },
      });
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].state).toBe('TRIGGERED');
    });

    test('generates acknowledged data point when acknowledgedTime present', () => {
      const result = dataPointsGenerator({
        startTime: 1000,
        acknowledgedTime: 1500,
        endTime: 2000,
        lastEndTime: null,
        windowEndTime: 3000,
        meta: { id: 'alert-1' },
      });
      const states = result.map((p) => p.state);
      expect(states).toContain('TRIGGERED');
      expect(states).toContain('ACKNOWLEDGED');
    });

    test('generates NO_ALERTS gap when lastEndTime present', () => {
      const result = dataPointsGenerator({
        startTime: 2000,
        acknowledgedTime: null,
        endTime: 3000,
        lastEndTime: 1000,
        windowEndTime: 4000,
        meta: {},
      });
      expect(result[0].state).toBe('NO_ALERTS');
    });

    test('clips to windowEndTime when endTime exceeds it', () => {
      const result = dataPointsGenerator({
        startTime: 1000,
        acknowledgedTime: null,
        endTime: 5000,
        lastEndTime: null,
        windowEndTime: 3000,
        meta: {},
      });
      const triggered = result.find((p) => p.state === 'TRIGGERED');
      expect(triggered.x).toBe(3000);
    });
  });
});

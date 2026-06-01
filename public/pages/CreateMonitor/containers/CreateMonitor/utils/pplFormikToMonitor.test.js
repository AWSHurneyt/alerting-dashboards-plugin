/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { pplToV2Schedule, buildPPLMonitorFromFormik } from './pplFormikToMonitor';

describe('pplFormikToMonitor', () => {
  describe('pplToV2Schedule', () => {
    test('returns interval schedule for frequency=interval', () => {
      const result = pplToV2Schedule({
        frequency: 'interval',
        period: { interval: 5, unit: 'MINUTES' },
      });
      expect(result).toEqual({ period: { interval: 5, unit: 'MINUTES' } });
    });

    test('returns cron for daily frequency', () => {
      const result = pplToV2Schedule({ frequency: 'daily', daily: '8 30', timezone: 'US/Pacific' });
      expect(result).toEqual({ cron: { expression: '0 8 30 * * *', timezone: 'US/Pacific' } });
    });

    test('returns cron for cronExpression frequency', () => {
      const result = pplToV2Schedule({
        frequency: 'cronExpression',
        cronExpression: '0 */5 * * *',
        timezone: 'UTC',
      });
      expect(result).toEqual({ cron: { expression: '0 */5 * * *', timezone: 'UTC' } });
    });

    test('defaults to 1 minute interval when no frequency matches', () => {
      const result = pplToV2Schedule({ frequency: 'unknown' });
      expect(result).toEqual({ period: { interval: 1, unit: 'MINUTES' } });
    });

    test('handles timezone as array', () => {
      const result = pplToV2Schedule({
        frequency: 'daily',
        daily: '0 0',
        timezone: [{ label: 'US/Eastern' }],
      });
      expect(result.cron.timezone).toBe('US/Eastern');
    });
  });

  describe('buildPPLMonitorFromFormik', () => {
    const baseValues = {
      name: 'Test Monitor',
      description: 'A test',
      disabled: false,
      pplQuery: 'source = my_index | stats count()',
      frequency: 'interval',
      period: { interval: 1, unit: 'MINUTES' },
      triggerDefinitions: [],
      useLookBackWindow: true,
      lookBackAmount: 1,
      lookBackUnit: 'hours',
      timestampField: '@timestamp',
    };

    test('builds monitor with ppl_monitor wrapper', () => {
      const result = buildPPLMonitorFromFormik(baseValues);
      expect(result.ppl_monitor).toBeDefined();
      expect(result.ppl_monitor.name).toBe('Test Monitor');
      expect(result.ppl_monitor.query).toBe('source = my_index | stats count()');
    });

    test('includes schedule', () => {
      const result = buildPPLMonitorFromFormik(baseValues);
      expect(result.ppl_monitor.schedule).toEqual({ period: { interval: 1, unit: 'MINUTES' } });
    });

    test('includes lookback window when enabled', () => {
      const result = buildPPLMonitorFromFormik(baseValues);
      expect(result.ppl_monitor.look_back_window_minutes).toBe(60);
      expect(result.ppl_monitor.timestamp_field).toBe('@timestamp');
    });

    test('sets lookback to null when disabled', () => {
      const result = buildPPLMonitorFromFormik({ ...baseValues, useLookBackWindow: false });
      expect(result.ppl_monitor.look_back_window_minutes).toBeNull();
      expect(result.ppl_monitor.timestamp_field).toBeNull();
    });

    test('creates default trigger when triggerDefinitions is empty', () => {
      const result = buildPPLMonitorFromFormik(baseValues);
      expect(result.ppl_monitor.triggers).toHaveLength(1);
      expect(result.ppl_monitor.triggers[0].name).toBe('trigger1');
      expect(result.ppl_monitor.triggers[0].type).toBe('number_of_results');
    });

    test('converts trigger definitions to wire format', () => {
      const values = {
        ...baseValues,
        triggerDefinitions: [
          {
            name: 'High Count',
            severity: 'high',
            type: 'number_of_results',
            num_results_condition: '>=',
            num_results_value: 100,
            actions: [],
          },
        ],
      };
      const result = buildPPLMonitorFromFormik(values);
      expect(result.ppl_monitor.triggers[0].name).toBe('High Count');
      expect(result.ppl_monitor.triggers[0].severity).toBe('high');
      expect(result.ppl_monitor.triggers[0].num_results_value).toBe(100);
    });

    test('sets enabled based on disabled flag', () => {
      const result = buildPPLMonitorFromFormik({ ...baseValues, disabled: true });
      expect(result.ppl_monitor.enabled).toBe(false);
    });
  });
});

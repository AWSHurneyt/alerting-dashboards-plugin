/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  triggerToFormik,
  triggerDefinitionsToFormik,
  queryLevelTriggerToFormik,
  bucketLevelTriggerToFormik,
  documentLevelTriggerToFormik,
  segmentArray,
} from './triggerToFormik';

describe('triggerToFormik', () => {
  const queryLevelMonitor = { monitor_type: 'monitor', ui_metadata: { triggers: {} } };
  const bucketLevelMonitor = {
    monitor_type: 'bucket_level_monitor',
    ui_metadata: { triggers: {} },
  };
  const docLevelMonitor = { monitor_type: 'doc_level_monitor', ui_metadata: { triggers: {} } };

  describe('triggerToFormik', () => {
    test('handles array of triggers', () => {
      const triggers = [
        {
          query_level_trigger: {
            id: '1',
            name: 'T1',
            severity: '1',
            condition: { script: { source: 'ctx.results[0].hits.total.value > 0' } },
            actions: [],
            min_time_between_executions: null,
            rolling_window_size: null,
          },
        },
      ];
      const result = triggerToFormik(triggers, queryLevelMonitor);
      expect(result.triggerDefinitions).toHaveLength(1);
      expect(result.triggerDefinitions[0].name).toBe('T1');
    });

    test('handles single trigger', () => {
      const trigger = {
        query_level_trigger: {
          id: '1',
          name: 'T1',
          severity: '1',
          condition: { script: { source: 'ctx.results[0].hits.total.value > 0' } },
          actions: [],
          min_time_between_executions: null,
          rolling_window_size: null,
        },
      };
      const result = triggerToFormik(trigger, queryLevelMonitor);
      expect(result.name).toBe('T1');
    });
  });

  describe('queryLevelTriggerToFormik', () => {
    test('extracts trigger fields', () => {
      const trigger = {
        query_level_trigger: {
          id: 'trig-1',
          name: 'High Error Rate',
          severity: '2',
          condition: {
            script: { source: 'ctx.results[0].hits.total.value > 100', lang: 'painless' },
          },
          actions: [
            {
              id: 'act-1',
              name: 'Notify',
              destination_id: 'dest-1',
              message_template: { source: 'Alert!' },
              throttle_enabled: false,
              throttle: { value: 10, unit: 'MINUTES' },
            },
          ],
          min_time_between_executions: 60000,
          rolling_window_size: 10,
        },
      };
      const result = queryLevelTriggerToFormik(trigger, queryLevelMonitor);
      expect(result.id).toBe('trig-1');
      expect(result.name).toBe('High Error Rate');
      expect(result.severity).toBe('2');
      expect(result.actions).toHaveLength(1);
      expect(result.actions[0].name).toBe('Notify');
    });
  });

  describe('bucketLevelTriggerToFormik', () => {
    test('extracts bucket level trigger fields', () => {
      const trigger = {
        bucket_level_trigger: {
          id: 'trig-2',
          name: 'Bucket Trigger',
          severity: '3',
          condition: { script: { source: 'params._count > 5', lang: 'painless' } },
          actions: [],
          min_time_between_executions: null,
          rolling_window_size: null,
          bucket_level_trigger: undefined,
        },
      };
      const result = bucketLevelTriggerToFormik(trigger, bucketLevelMonitor);
      expect(result.id).toBe('trig-2');
      expect(result.name).toBe('Bucket Trigger');
    });
  });

  describe('documentLevelTriggerToFormik', () => {
    test('extracts document level trigger fields', () => {
      const trigger = {
        document_level_trigger: {
          id: 'trig-3',
          name: 'Doc Trigger',
          severity: '1',
          condition: { script: { source: 'true', lang: 'painless' } },
          actions: [],
          min_time_between_executions: null,
          rolling_window_size: null,
        },
      };
      const result = documentLevelTriggerToFormik(trigger, docLevelMonitor);
      expect(result.id).toBe('trig-3');
      expect(result.name).toBe('Doc Trigger');
    });
  });

  describe('segmentArray', () => {
    test('segments script source by whitespace', () => {
      const result = segmentArray('a && b || c && d', 3);
      // First segment is segmentSize-1 (2 items), then chunks of 3
      expect(result[0]).toEqual(['a', '&&']);
      expect(result.length).toBeGreaterThan(1);
    });

    test('handles single-word source', () => {
      const result = segmentArray('condition', 3);
      expect(result).toEqual([['condition']]);
    });
  });
});

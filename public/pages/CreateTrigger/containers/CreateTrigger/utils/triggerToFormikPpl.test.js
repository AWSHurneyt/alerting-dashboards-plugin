/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { triggerToFormikPpl } from './triggerToFormikPpl';

describe('triggerToFormikPpl', () => {
  test('converts basic trigger', () => {
    const trigger = {
      id: 't1',
      name: 'High Count',
      severity: 'high',
      type: 'number_of_results',
      num_results_condition: '>=',
      num_results_value: 100,
      actions: [],
    };
    const result = triggerToFormikPpl(trigger);
    expect(result.name).toBe('High Count');
    expect(result.severity).toBe('high');
    expect(result.num_results_value).toBe(100);
    expect(result.num_results_condition).toBe('>=');
    expect(result.type).toBe('number_of_results');
  });

  test('handles custom condition trigger', () => {
    const trigger = {
      name: 'Custom',
      type: 'custom_condition',
      custom_condition: 'ctx.results[0].hits.total > 5',
    };
    const result = triggerToFormikPpl(trigger);
    expect(result.type).toBe('custom_condition');
    expect(result.custom_condition).toBe('ctx.results[0].hits.total > 5');
  });

  test('converts throttle_minutes to formik duration', () => {
    const trigger = { name: 'T', throttle_minutes: 120 };
    const result = triggerToFormikPpl(trigger);
    expect(result.throttle_enabled).toBe(true);
    expect(result.suppress).toEqual({ value: 2, unit: 'hours' });
  });

  test('converts expires_minutes to formik duration', () => {
    const trigger = { name: 'T', expires_minutes: 1440 };
    const result = triggerToFormikPpl(trigger);
    expect(result.expires).toEqual({ value: 1, unit: 'days' });
  });

  test('handles null/undefined trigger', () => {
    const result = triggerToFormikPpl(null);
    expect(result.name).toBe('');
    expect(result.severity).toBe('info');
    expect(result.type).toBe('number_of_results');
  });

  test('defaults expires to 7 days when not specified', () => {
    const result = triggerToFormikPpl({ name: 'T' });
    expect(result.expires).toEqual({ value: 7, unit: 'days' });
  });

  test('throttle_enabled is false when no throttle', () => {
    const result = triggerToFormikPpl({ name: 'T' });
    expect(result.throttle_enabled).toBe(false);
  });
});

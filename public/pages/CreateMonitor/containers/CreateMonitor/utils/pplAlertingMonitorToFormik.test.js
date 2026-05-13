/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

jest.mock('./constants', () => ({
  FORMIK_INITIAL_VALUES: {
    name: '',
    pplQuery: '',
    searchType: 'query',
    cronExpression: '0 */1 * * *',
    triggerDefinitions: [],
    disabled: false,
    index: [],
    timezone: [],
  },
  FORMIK_INITIAL_DOCUMENT_LEVEL_QUERY_VALUES: { field: '', query: '', operator: 'is' },
}));
jest.mock('../../../../../utils/constants', () => ({
  SEARCH_TYPE: { AD: 'ad', CLUSTER_METRICS: 'clusterMetrics', QUERY: 'query' },
  INPUTS_DETECTOR_ID: '0.search.indices.0',
  MONITOR_TYPE: {
    CLUSTER_METRICS: 'cluster_metrics_monitor',
    DOC_LEVEL: 'doc_level_monitor',
    COMPOSITE_LEVEL: 'composite_level_monitor',
    QUERY_LEVEL: 'monitor',
  },
}));
jest.mock('../../../components/MonitorExpressions/expressions/utils/constants', () => ({
  OPERATORS_MAP: {
    IS: { value: 'is' },
    IS_NOT: { value: 'is_not' },
    IS_GREATER: { value: 'is_greater' },
    IS_GREATER_EQUAL: { value: 'is_greater_equal' },
    IS_LESS: { value: 'is_less' },
    IS_LESS_EQUAL: { value: 'is_less_equal' },
  },
}));
jest.mock('../../../components/DocumentLevelMonitorQueries/utils/constants', () => ({
  DOC_LEVEL_INPUT_FIELD: 'doc_level_input',
  QUERY_STRING_QUERY_OPERATORS: {
    is_greater: '>',
    is_greater_equal: '>=',
    is_less: '<',
    is_less_equal: '<=',
  },
}));
jest.mock('../../../../CreateTrigger/utils/helper', () => ({
  conditionToExpressions: jest.fn(() => []),
}));

import pplAlertingMonitorToFormik, { indicesToFormik } from './pplAlertingMonitorToFormik';

describe('pplAlertingMonitorToFormik', () => {
  test('returns defaults for null input', () => {
    const result = pplAlertingMonitorToFormik(null);
    expect(result.name).toBe('');
  });

  test('extracts name and description', () => {
    const result = pplAlertingMonitorToFormik({
      name: 'My Monitor',
      description: 'Desc',
      enabled: true,
      schedule: { period: { interval: 1, unit: 'MINUTES' } },
    });
    expect(result.name).toBe('My Monitor');
    expect(result.description).toBe('Desc');
  });

  test('extracts pplQuery from monitor.query', () => {
    const result = pplAlertingMonitorToFormik({
      name: 'M',
      enabled: true,
      query: 'source = idx | stats count()',
      schedule: {},
    });
    expect(result.pplQuery).toBe('source = idx | stats count()');
  });

  test('sets disabled=true when enabled=false', () => {
    const result = pplAlertingMonitorToFormik({ name: 'M', enabled: false, schedule: {} });
    expect(result.disabled).toBe(true);
  });

  test('extracts interval schedule', () => {
    const result = pplAlertingMonitorToFormik({
      name: 'M',
      enabled: true,
      schedule: { period: { interval: 5, unit: 'MINUTES' } },
    });
    expect(result.frequency).toBe('interval');
    expect(result.period).toEqual({ interval: 5, unit: 'MINUTES' });
  });

  test('extracts cron schedule', () => {
    const result = pplAlertingMonitorToFormik({
      name: 'M',
      enabled: true,
      schedule: { cron: { expression: '0 */5 * * *', timezone: 'UTC' } },
    });
    expect(result.cronExpression).toBe('0 */5 * * *');
    expect(result.timezone).toEqual([{ label: 'UTC' }]);
  });

  test('extracts lookback window from ui_metadata', () => {
    const result = pplAlertingMonitorToFormik({
      name: 'M',
      enabled: true,
      schedule: {},
      ui_metadata: {
        lookback: {
          enabled: true,
          minutes: 120,
          amount: 2,
          unit: 'hours',
          timestamp_field: '@timestamp',
        },
      },
    });
    expect(result.useLookBackWindow).toBe(true);
    expect(result.lookBackAmount).toBe(2);
    expect(result.lookBackUnit).toBe('hours');
  });

  test('derives lookback from look_back_window_minutes when no ui_metadata', () => {
    const result = pplAlertingMonitorToFormik({
      name: 'M',
      enabled: true,
      schedule: {},
      look_back_window_minutes: 1440,
    });
    expect(result.useLookBackWindow).toBe(true);
    expect(result.lookBackAmount).toBe(1);
    expect(result.lookBackUnit).toBe('days');
  });

  test('sets useLookBackWindow=false when no lookback data', () => {
    const result = pplAlertingMonitorToFormik({ name: 'M', enabled: true, schedule: {} });
    expect(result.useLookBackWindow).toBe(false);
  });

  test('unwraps ppl_monitor wrapper', () => {
    const result = pplAlertingMonitorToFormik({
      ppl_monitor: { name: 'Wrapped', enabled: true, query: 'source = x', schedule: {} },
    });
    expect(result.name).toBe('Wrapped');
    expect(result.pplQuery).toBe('source = x');
  });
});

describe('indicesToFormik', () => {
  test('converts index array to label objects', () => {
    expect(indicesToFormik(['idx-1', 'idx-2'])).toEqual([{ label: 'idx-1' }, { label: 'idx-2' }]);
  });
});

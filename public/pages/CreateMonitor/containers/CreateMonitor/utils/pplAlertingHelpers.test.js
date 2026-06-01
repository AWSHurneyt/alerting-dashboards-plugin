/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

jest.mock('./constants', () => ({
  FORMIK_INITIAL_VALUES: {
    name: '',
    pplQuery: '',
    searchType: 'query',
    monitor_mode: 'ppl',
    triggerDefinitions: [],
  },
  LOOKBACK_WINDOW_MAX_MINUTES: 10080,
}));

jest.mock('../../../../../utils/helpers', () => ({
  getDataSourceQueryObj: jest.fn(() => null),
  backendErrorNotification: jest.fn(),
  getDigitId: jest.fn(() => '12345'),
}));

jest.mock('../../../../utils/helpers', () => ({
  getDataSourceQueryObj: jest.fn(() => null),
}));

jest.mock('./monitorQueryParams', () => ({
  initializeFromQueryParams: jest.fn(() => ({})),
}));

jest.mock('./pplAlertingMonitorToFormik', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));
jest.mock('./pplFormikToMonitor', () => ({
  buildPPLMonitorFromFormik: jest.fn(() => ({})),
  pplToV2Schedule: jest.fn(() => ({})),
}));
jest.mock('../../../../CreateTrigger/containers/CreateTrigger/utils/formikToTrigger', () => ({
  formikToTrigger: jest.fn(() => []),
  formikToTriggerUiMetadata: jest.fn(() => ({})),
}));
jest.mock('../../../../CreateTrigger/containers/CreateTrigger/utils/triggerToFormikPpl', () => ({
  triggerToFormikPpl: jest.fn(() => ({})),
}));
jest.mock('../../../../CreateTrigger/containers/CreateTrigger/utils/constants', () => ({
  TRIGGER_TYPE: {
    QUERY_LEVEL: 'query_level_trigger',
    BUCKET_LEVEL: 'bucket_level_trigger',
    DOC_LEVEL: 'document_level_trigger',
    COMPOSITE_LEVEL: 'chained_alert_trigger',
  },
}));
jest.mock('../../../../CreateTrigger/components/AddTriggerButton/utils', () => ({
  getInitialTriggerValues: jest.fn(() => ({})),
}));
jest.mock('../../../components/MonitorExpressions/expressions/utils/constants', () => ({
  AGGREGATION_TYPES: [{ value: 'count' }, { value: 'avg' }],
}));

import {
  extractIndicesFromPPL,
  computeLookBackMinutes,
  addTimeFilterToQuery,
  formatDuration,
  getPlugins,
  prepareTriggers,
  makeAlertingV2Service,
  findCommonDateFields,
  runPPLPreview,
  create,
  update,
} from './pplAlertingHelpers';

describe('pplAlertingHelpers', () => {
  describe('extractIndicesFromPPL', () => {
    test('extracts single index', () => {
      expect(extractIndicesFromPPL('source = my_index | stats count()')).toEqual(['my_index']);
    });

    test('extracts multiple indices', () => {
      expect(extractIndicesFromPPL('source = idx1, idx2, idx3')).toEqual(['idx1', 'idx2', 'idx3']);
    });

    test('handles backtick-quoted indices', () => {
      expect(extractIndicesFromPPL('source = `my-index-*`')).toEqual(['my-index-*']);
    });

    test('returns empty for null/undefined/empty', () => {
      expect(extractIndicesFromPPL(null)).toEqual([]);
      expect(extractIndicesFromPPL(undefined)).toEqual([]);
      expect(extractIndicesFromPPL('')).toEqual([]);
    });

    test('returns empty for invalid query without source', () => {
      expect(extractIndicesFromPPL('SELECT * FROM table')).toEqual([]);
    });
  });

  describe('computeLookBackMinutes', () => {
    test('returns 0 when useLookBackWindow is false', () => {
      expect(
        computeLookBackMinutes({
          useLookBackWindow: false,
          lookBackAmount: 5,
          lookBackUnit: 'hours',
        })
      ).toBe(0);
    });

    test('converts hours to minutes', () => {
      expect(
        computeLookBackMinutes({
          useLookBackWindow: true,
          lookBackAmount: 2,
          lookBackUnit: 'hours',
        })
      ).toBe(120);
    });

    test('converts days to minutes', () => {
      expect(
        computeLookBackMinutes({ useLookBackWindow: true, lookBackAmount: 1, lookBackUnit: 'days' })
      ).toBe(1440);
    });

    test('returns raw minutes for minutes unit', () => {
      expect(
        computeLookBackMinutes({
          useLookBackWindow: true,
          lookBackAmount: 30,
          lookBackUnit: 'minutes',
        })
      ).toBe(30);
    });

    test('returns 0 for invalid amount', () => {
      expect(
        computeLookBackMinutes({
          useLookBackWindow: true,
          lookBackAmount: -1,
          lookBackUnit: 'hours',
        })
      ).toBe(0);
      expect(
        computeLookBackMinutes({
          useLookBackWindow: true,
          lookBackAmount: NaN,
          lookBackUnit: 'hours',
        })
      ).toBe(0);
    });
  });

  describe('addTimeFilterToQuery', () => {
    const fixedEnd = new Date('2024-01-15T12:00:00Z');

    test('injects time filter before first pipe', () => {
      const result = addTimeFilterToQuery(
        'source = idx | stats count()',
        60,
        '@timestamp',
        fixedEnd
      );
      expect(result).toContain("where @timestamp > TIMESTAMP('2024-01-15 11:00:00')");
      expect(result).toContain("and @timestamp < TIMESTAMP('2024-01-15 12:00:00')");
      expect(result).toContain('| stats count()');
    });

    test('appends time filter when no pipes', () => {
      const result = addTimeFilterToQuery('source = idx', 60, '@timestamp', fixedEnd);
      expect(result).toContain("where @timestamp > TIMESTAMP('2024-01-15 11:00:00')");
    });

    test('returns query unchanged when lookBackMinutes is 0', () => {
      expect(addTimeFilterToQuery('source = idx', 0, '@timestamp', fixedEnd)).toBe('source = idx');
    });

    test('returns query unchanged when timestampField is empty', () => {
      expect(addTimeFilterToQuery('source = idx', 60, '', fixedEnd)).toBe('source = idx');
    });
  });

  describe('formatDuration', () => {
    test('formats minutes', () => {
      expect(formatDuration(30)).toBe('30 minutes');
      expect(formatDuration(1)).toBe('1 minute');
    });

    test('formats hours', () => {
      expect(formatDuration(60)).toBe('1 hour');
      expect(formatDuration(120)).toBe('2 hours');
      expect(formatDuration(65)).toBe('1 hr 5 min');
    });

    test('formats days', () => {
      expect(formatDuration(1440)).toBe('1 d');
      expect(formatDuration(1500)).toBe('1 d 1 hr');
      expect(formatDuration(1505)).toBe('1 d 1 hr 5 min');
    });

    test('handles zero', () => {
      expect(formatDuration(0)).toBe('0 minutes');
    });

    test('handles null/undefined/invalid', () => {
      expect(formatDuration(null)).toBe('-');
      expect(formatDuration(undefined)).toBe('-');
      expect(formatDuration('abc')).toBe('-');
      expect(formatDuration(-1)).toBe('-');
    });
  });

  describe('getPlugins', () => {
    test('returns plugin components on success', async () => {
      const httpClient = {
        get: jest.fn().mockResolvedValue({
          ok: true,
          resp: [{ component: 'alerting' }, { component: 'anomaly_detection' }],
        }),
      };
      const result = await getPlugins(httpClient);
      expect(result).toEqual(['alerting', 'anomaly_detection']);
    });

    test('returns empty array on failure', async () => {
      const httpClient = { get: jest.fn().mockResolvedValue({ ok: false }) };
      const result = await getPlugins(httpClient);
      expect(result).toEqual([]);
    });

    test('returns empty array on exception', async () => {
      const httpClient = { get: jest.fn().mockRejectedValue(new Error('network')) };
      const result = await getPlugins(httpClient);
      expect(result).toEqual([]);
    });
  });

  describe('prepareTriggers', () => {
    test('adds trigger in edit mode', () => {
      const result = prepareTriggers({
        trigger: { query_level_trigger: { name: 'new' } },
        triggerMetadata: { new: {} },
        monitor: { ui_metadata: { triggers: {} }, triggers: [], monitor_type: 'monitor' },
        edit: true,
      });
      expect(result.triggers).toHaveLength(1);
      expect(result.ui_metadata.triggers.new).toBeDefined();
    });

    test('replaces trigger in update mode with array triggerToEdit', () => {
      const result = prepareTriggers({
        trigger: [{ query_level_trigger: { name: 'updated' } }],
        triggerMetadata: { updated: {} },
        monitor: {
          ui_metadata: { triggers: { old: {} } },
          triggers: [{ query_level_trigger: { name: 'old' } }],
          monitor_type: 'monitor',
        },
        edit: false,
        triggerToEdit: [{ query_level_trigger: { name: 'old' } }],
      });
      expect(result.triggers).toEqual([{ query_level_trigger: { name: 'updated' } }]);
    });
  });

  describe('makeAlertingV2Service', () => {
    let httpClient;
    let service;

    beforeEach(() => {
      httpClient = {
        post: jest.fn().mockResolvedValue({ ok: true, resp: { _id: 'mon-1' } }),
        put: jest.fn().mockResolvedValue({ ok: true, resp: { _id: 'mon-1' } }),
        get: jest.fn().mockResolvedValue({ ok: true, resp: { alerts: [] } }),
      };
      service = makeAlertingV2Service(httpClient);
    });

    test('createMonitor posts to v2 endpoint', async () => {
      const result = await service.createMonitor({ name: 'test' });
      expect(httpClient.post).toHaveBeenCalledWith('/api/alerting/v2/monitors', expect.anything());
      expect(result).toEqual({ _id: 'mon-1' });
    });

    test('updateMonitor puts to v2 endpoint', async () => {
      await service.updateMonitor('mon-1', { name: 'updated' });
      expect(httpClient.put).toHaveBeenCalledWith(
        '/api/alerting/v2/monitors/mon-1',
        expect.anything()
      );
    });

    test('getAlerts fetches from v2 endpoint', async () => {
      await service.getAlerts({ monitorId: 'mon-1' });
      expect(httpClient.get).toHaveBeenCalledWith(
        '/api/alerting/v2/alerts',
        expect.objectContaining({ query: expect.objectContaining({ monitorId: 'mon-1' }) })
      );
    });

    test('createMonitor throws on failure', async () => {
      httpClient.post.mockResolvedValue({ ok: false, resp: 'error msg' });
      await expect(service.createMonitor({})).rejects.toBe('error msg');
    });
  });

  describe('findCommonDateFields', () => {
    test('returns error for empty indices', async () => {
      const httpClient = { post: jest.fn() };
      const result = await findCommonDateFields(httpClient, [], null);
      expect(result.commonDateFields).toEqual([]);
      expect(result.error).toBe('No indices specified');
    });

    test('returns date fields from mappings', async () => {
      const httpClient = {
        post: jest.fn().mockResolvedValue({
          ok: true,
          resp: {
            'my-index': {
              mappings: {
                properties: { '@timestamp': { type: 'date' }, name: { type: 'keyword' } },
              },
            },
          },
        }),
      };
      const result = await findCommonDateFields(httpClient, ['my-index'], null);
      expect(result.commonDateFields).toEqual(['@timestamp']);
      expect(result.error).toBeNull();
    });

    test('returns intersection of date fields across indices', async () => {
      const httpClient = {
        post: jest.fn().mockResolvedValue({
          ok: true,
          resp: {
            'idx-1': {
              mappings: {
                properties: { '@timestamp': { type: 'date' }, created: { type: 'date' } },
              },
            },
            'idx-2': {
              mappings: {
                properties: { '@timestamp': { type: 'date' }, updated: { type: 'date' } },
              },
            },
          },
        }),
      };
      const result = await findCommonDateFields(httpClient, ['idx-1', 'idx-2'], null);
      expect(result.commonDateFields).toEqual(['@timestamp']);
    });
  });

  describe('runPPLPreview', () => {
    test('returns response on success', async () => {
      const httpClient = {
        post: jest.fn().mockResolvedValue({ ok: true, resp: { datarows: [[1]] } }),
      };
      const result = await runPPLPreview(httpClient, { queryText: 'source = idx' });
      expect(result).toEqual({ datarows: [[1]] });
    });

    test('returns error on failure', async () => {
      const httpClient = {
        post: jest.fn().mockResolvedValue({ ok: false, resp: { message: 'bad query' } }),
      };
      const result = await runPPLPreview(httpClient, { queryText: 'bad' });
      expect(result.ok).toBe(false);
      expect(result.error).toBe('bad query');
    });

    test('returns error on exception', async () => {
      const httpClient = { post: jest.fn().mockRejectedValue(new Error('network')) };
      const result = await runPPLPreview(httpClient, { queryText: 'source = idx' });
      expect(result.ok).toBe(false);
      expect(result.error).toBe('network');
    });
  });

  describe('create', () => {
    test('posts monitor and navigates on success', async () => {
      const httpClient = {
        post: jest.fn().mockResolvedValue({ ok: true, resp: { _id: 'new-id' } }),
      };
      const history = { push: jest.fn() };
      const formikBag = { setSubmitting: jest.fn() };
      await create({
        monitor: { name: 'test' },
        formikBag,
        httpClient,
        notifications: {},
        history,
      });
      expect(httpClient.post).toHaveBeenCalledWith('/api/alerting/monitors', expect.anything());
      expect(history.push).toHaveBeenCalledWith('/monitors/new-id?type=monitor');
      expect(formikBag.setSubmitting).toHaveBeenCalledWith(false);
    });

    test('shows error on failure', async () => {
      const httpClient = { post: jest.fn().mockResolvedValue({ ok: false, resp: 'err' }) };
      const notifications = { toasts: { addDanger: jest.fn() } };
      const formikBag = { setSubmitting: jest.fn() };
      await create({
        monitor: { name: 'test' },
        formikBag,
        httpClient,
        notifications,
        history: { push: jest.fn() },
      });
      expect(formikBag.setSubmitting).toHaveBeenCalledWith(false);
    });
  });

  describe('update', () => {
    test('calls updateMonitor and navigates on success', async () => {
      const updateMonitor = jest.fn().mockResolvedValue({ ok: true, id: 'mon-1' });
      const history = { push: jest.fn() };
      const notifications = { toasts: { addSuccess: jest.fn() } };
      const formikBag = { setSubmitting: jest.fn() };
      await update({ history, updateMonitor, notifications, monitor: { name: 'test' }, formikBag });
      expect(history.push).toHaveBeenCalledWith('/monitors/mon-1?type=monitor');
      expect(notifications.toasts.addSuccess).toHaveBeenCalled();
    });
  });
});

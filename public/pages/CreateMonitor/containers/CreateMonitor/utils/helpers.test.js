/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

jest.mock('./constants', () => ({
  FORMIK_INITIAL_VALUES: { name: '', index: [], triggerDefinitions: [], searchType: 'query' },
}));
jest.mock('./monitorToFormik', () => ({
  __esModule: true,
  default: jest.fn(() => ({ name: 'Edited' })),
}));
jest.mock('./formikToMonitor', () => ({
  formikToMonitor: jest.fn(() => ({ name: 'test', ui_metadata: {} })),
}));
jest.mock('./monitorQueryParams', () => ({ initializeFromQueryParams: jest.fn(() => ({})) }));
jest.mock('../../../../../utils/constants', () => ({
  MONITOR_TYPE: {
    QUERY_LEVEL: 'monitor',
    BUCKET_LEVEL: 'bucket_level_monitor',
    DOC_LEVEL: 'doc_level_monitor',
    COMPOSITE_LEVEL: 'composite_level_monitor',
  },
}));
jest.mock('../../../../../utils/helpers', () => ({
  backendErrorNotification: jest.fn(),
  getDigitId: jest.fn(() => '99999'),
}));
jest.mock('../../../../CreateTrigger/containers/CreateTrigger/utils/formikToTrigger', () => ({
  formikToTrigger: jest.fn(() => []),
  formikToTriggerUiMetadata: jest.fn(() => ({})),
}));
jest.mock('../../../../CreateTrigger/containers/CreateTrigger/utils/triggerToFormik', () => ({
  triggerToFormik: jest.fn(() => ({ triggerDefinitions: [] })),
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
  getInitialTriggerValues: jest.fn(() => ({ name: 'trigger1' })),
}));
jest.mock('../../../components/MonitorExpressions/expressions/utils/constants', () => ({
  AGGREGATION_TYPES: [{ value: 'count' }, { value: 'avg' }],
}));
jest.mock('../../../../utils/helpers', () => ({
  getDataSourceQueryObj: jest.fn(() => null),
}));

import { getInitialValues, getPlugins, prepareTriggers, create, update } from './helpers';

describe('helpers (CreateMonitor utils)', () => {
  describe('getInitialValues', () => {
    const baseArgs = { location: { search: '' } };

    test('returns default values for create mode', () => {
      const result = getInitialValues(baseArgs);
      expect(result.name).toBe('');
    });

    test('sets name and index in flyout mode', () => {
      const result = getInitialValues({
        ...baseArgs,
        flyoutMode: 'create',
        title: 'My Vis',
        index: [{ label: 'idx' }],
        timeField: '@timestamp',
      });
      expect(result.name).toBe('My Vis 99999');
      expect(result.index).toEqual([{ label: 'idx' }]);
    });

    test('uses monitorToFormik in edit mode', () => {
      const result = getInitialValues({
        ...baseArgs,
        edit: true,
        monitorToEdit: { name: 'Existing', triggers: [] },
      });
      expect(result.name).toBe('Edited');
    });
  });

  describe('getPlugins', () => {
    test('returns plugin list on success', async () => {
      const httpClient = {
        get: jest.fn().mockResolvedValue({ ok: true, resp: [{ component: 'alerting' }] }),
      };
      expect(await getPlugins(httpClient)).toEqual(['alerting']);
    });

    test('returns empty on failure', async () => {
      const httpClient = { get: jest.fn().mockResolvedValue({ ok: false }) };
      expect(await getPlugins(httpClient)).toEqual([]);
    });
  });

  describe('prepareTriggers', () => {
    test('appends trigger in edit mode', () => {
      const result = prepareTriggers({
        trigger: { query_level_trigger: { name: 'new' } },
        triggerMetadata: { new: {} },
        monitor: { ui_metadata: { triggers: {} }, triggers: [], monitor_type: 'monitor' },
        edit: true,
      });
      expect(result.triggers).toHaveLength(1);
    });
  });

  describe('create', () => {
    test('posts monitor and navigates on success', async () => {
      const httpClient = { post: jest.fn().mockResolvedValue({ ok: true, resp: { _id: 'id-1' } }) };
      const history = { push: jest.fn() };
      const formikBag = { setSubmitting: jest.fn() };
      await create({
        monitor: { name: 'test' },
        formikBag,
        httpClient,
        notifications: {},
        history,
      });
      expect(history.push).toHaveBeenCalledWith('/monitors/id-1?type=monitor');
    });
  });

  describe('update', () => {
    test('calls updateMonitor and navigates', async () => {
      const updateMonitor = jest.fn().mockResolvedValue({ ok: true, id: 'id-1' });
      const history = { push: jest.fn() };
      const notifications = { toasts: { addSuccess: jest.fn() } };
      const formikBag = { setSubmitting: jest.fn() };
      await update({ history, updateMonitor, notifications, monitor: { name: 'M' }, formikBag });
      expect(history.push).toHaveBeenCalledWith('/monitors/id-1?type=monitor');
    });
  });
});

/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

jest.mock('../../services/services', () => ({
  getDataSourceEnabled: jest.fn(() => ({ enabled: false })),
  getDataSource: jest.fn(() => ({ dataSourceId: 'ds-1' })),
  getAssistantClient: jest.fn(() => null),
}));
jest.mock('../../components/Comments/ShowAlertComments', () => ({
  ShowAlertComments: () => null,
}));
jest.mock('./constants', () => ({
  COMMENTS_ENABLED_SETTING: 'plugins.alerting.comments_enabled',
  SUMMARY_AGENT_CONFIG_ID: 'summary_agent',
  LOG_PATTERN_SUMMARY_AGENT_CONFIG_ID: 'log_pattern_agent',
}));

import {
  dataSourceEnabled,
  getDataSourceId,
  getDataSourceQueryObj,
  isDataSourceChanged,
  getURL,
  parseQueryStringAndGetDataSource,
} from './helpers';
import { getDataSourceEnabled, getDataSource } from '../../services/services';

describe('pages/utils/helpers', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('dataSourceEnabled', () => {
    test('returns false when disabled', () => {
      getDataSourceEnabled.mockReturnValue({ enabled: false });
      expect(dataSourceEnabled()).toBe(false);
    });

    test('returns true when enabled', () => {
      getDataSourceEnabled.mockReturnValue({ enabled: true });
      expect(dataSourceEnabled()).toBe(true);
    });
  });

  describe('getDataSourceId', () => {
    test('returns undefined when data source disabled', () => {
      getDataSourceEnabled.mockReturnValue({ enabled: false });
      expect(getDataSourceId()).toBeUndefined();
    });

    test('returns current dataSourceId when enabled', () => {
      getDataSourceEnabled.mockReturnValue({ enabled: true });
      getDataSource.mockReturnValue({ dataSourceId: 'ds-1' });
      expect(getDataSourceId()).toBe('ds-1');
    });

    test('returns fallback when current is empty', () => {
      getDataSourceEnabled.mockReturnValue({ enabled: true });
      getDataSource.mockReturnValue({ dataSourceId: '' });
      expect(getDataSourceId('fallback-ds')).toBe('fallback-ds');
    });
  });

  describe('getDataSourceQueryObj', () => {
    test('returns undefined when data source disabled', () => {
      getDataSourceEnabled.mockReturnValue({ enabled: false });
      expect(getDataSourceQueryObj()).toBeUndefined();
    });

    test('returns query object when enabled', () => {
      getDataSourceEnabled.mockReturnValue({ enabled: true });
      getDataSource.mockReturnValue({ dataSourceId: 'ds-1' });
      expect(getDataSourceQueryObj()).toEqual({ query: { dataSourceId: 'ds-1' } });
    });
  });

  describe('isDataSourceChanged', () => {
    test('returns false when data source disabled', () => {
      getDataSourceEnabled.mockReturnValue({ enabled: false });
      expect(isDataSourceChanged({ landingDataSourceId: 'a' }, { landingDataSourceId: 'b' })).toBe(
        false
      );
    });

    test('returns true when IDs differ and enabled', () => {
      getDataSourceEnabled.mockReturnValue({ enabled: true });
      expect(isDataSourceChanged({ landingDataSourceId: 'a' }, { landingDataSourceId: 'b' })).toBe(
        true
      );
    });
  });

  describe('getURL', () => {
    test('returns plain URL when disabled', () => {
      getDataSourceEnabled.mockReturnValue({ enabled: false });
      expect(getURL('/monitors?id=1', 'ds-1')).toBe('/monitors?id=1');
    });

    test('appends dataSourceId when enabled', () => {
      getDataSourceEnabled.mockReturnValue({ enabled: true });
      expect(getURL('/monitors?id=1', 'ds-1')).toBe('/monitors?id=1&dataSourceId=ds-1');
    });
  });

  describe('parseQueryStringAndGetDataSource', () => {
    test('extracts dataSourceId from query string', () => {
      expect(parseQueryStringAndGetDataSource('?action=edit&dataSourceId=ds-1')).toBe('ds-1');
    });

    test('returns undefined when no dataSourceId', () => {
      expect(parseQueryStringAndGetDataSource('?action=edit')).toBeUndefined();
    });
  });
});

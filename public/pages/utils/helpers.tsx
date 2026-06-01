/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { getDataSourceEnabled, getDataSource, getAssistantClient } from '../../services/services';
import _ from 'lodash';
import { ShowAlertComments } from '../../components/Comments/ShowAlertComments';
import {
  COMMENTS_ENABLED_SETTING,
  SUMMARY_AGENT_CONFIG_ID,
  LOG_PATTERN_SUMMARY_AGENT_CONFIG_ID,
} from './constants';

export function dataSourceEnabled(): boolean {
  return getDataSourceEnabled()?.enabled;
}

const normalizeDataSourceId = (dataSourceId: any): string | undefined => {
  if (dataSourceId === null || dataSourceId === undefined) {
    return undefined;
  }
  if (typeof dataSourceId === 'string') {
    const trimmed = dataSourceId.trim();
    return trimmed.length ? trimmed : undefined;
  }
  return dataSourceId;
};

export function getDataSourceId(fallbackDataSourceId?: string): string | undefined {
  if (!dataSourceEnabled()) {
    return undefined;
  }
  const currentId = normalizeDataSourceId(getDataSource()?.dataSourceId);
  const fallbackId = normalizeDataSourceId(fallbackDataSourceId);
  return currentId ?? fallbackId;
}

export function getDataSourceQueryObj(fallbackDataSourceId?: string): { query: { dataSourceId: string } } | undefined {
  const dataSourceId = getDataSourceId(fallbackDataSourceId);
  return dataSourceId !== undefined ? { query: { dataSourceId } } : undefined;
}

export function isDataSourceChanged(prevProps: any, currProps: any): boolean {
  return (
    dataSourceEnabled() && !_.isEqual(prevProps.landingDataSourceId, currProps.landingDataSourceId)
  );
}

export function getURL(url: string, dataSourceId: string): string {
  return dataSourceEnabled() ? `${url}&dataSourceId=${dataSourceId}` : url;
}

export function parseQueryStringAndGetDataSource(queryString: string): string | undefined {
  const params = {};
  const queryParams = queryString.substring(1).split('&');
  for (const param of queryParams) {
    const pair = param.split('=');
    params[pair[0]] = pair[1];
  }
  return params.hasOwnProperty('dataSourceId') ? params['dataSourceId'] || '' : undefined;
}

export function constructUrlFromDataSource(url: string): string {
  return dataSourceEnabled() ? `${url}&dataSourceId=${getDataSource()?.dataSourceId}` : url;
}

export const appendCommentsAction = (columns: any[], httpClient: any) => {
  const actionsColumn = columns.find(({ name }) => name === 'Actions');
  const showCommentsAction = {
    render: (alert) => <ShowAlertComments alert={alert} httpClient={httpClient} />,
  };

  if (actionsColumn) {
    actionsColumn.actions.push(showCommentsAction);
  } else {
    columns.push({
      name: 'Actions',
      sortable: false,
      actions: [showCommentsAction],
    });
  }

  return columns;
};

export async function getIsAgentConfigured(dataSourceId?: string): Promise<boolean> {
  const assistantClient = getAssistantClient();
  try {
    const res = await assistantClient.agentConfigExists(
      [SUMMARY_AGENT_CONFIG_ID, LOG_PATTERN_SUMMARY_AGENT_CONFIG_ID],
      { dataSourceId: dataSourceId }
    );
    return res.exists;
  } catch (e) {
    console.error('Error while checking if agent is configured:', e);
    return false;
  }
}

export async function getIsCommentsEnabled(httpClient: any): Promise<boolean> {
  let commentsEnabled = await getClusterSetting(httpClient, COMMENTS_ENABLED_SETTING, false);

  if (typeof commentsEnabled === 'string') {
    return JSON.parse(commentsEnabled);
  }

  return commentsEnabled;
}

export async function getClusterSetting(httpClient: any, setting: string, defaultValue: any): Promise<any> {
  let cluserSetting = defaultValue;

  try {
    const dataSourceQuery = getDataSourceQueryObj();
    const response = await httpClient.get('../api/alerting/_settings', dataSourceQuery);
    if (response.ok) {
      const { defaults, transient, persistent } = response.resp;
      cluserSetting = _.get(
        // If present, take the 'transient' setting.
        transient,
        setting,
        // Else take the 'persistent' setting.
        _.get(
          persistent,
          setting,
          // Else take the 'default' setting.
          _.get(defaults, setting, defaultValue)
        )
      );
    }
  } catch (e) {
    console.log('Error while retrieving settings:', e);
  }

  return cluserSetting;
}

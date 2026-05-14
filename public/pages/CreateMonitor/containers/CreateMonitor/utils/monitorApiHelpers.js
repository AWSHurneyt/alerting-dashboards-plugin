/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import _ from 'lodash';
import { MONITOR_TYPE } from '../../../../../utils/constants';
import { backendErrorNotification } from '../../../../../utils/helpers';
import { TRIGGER_TYPE } from '../../../../CreateTrigger/containers/CreateTrigger/utils/constants';
import { getDataSourceQueryObj } from '../../../../utils/helpers';

/**
 * Fetch the list of installed plugins.
 * @param {object} httpClient
 * @param {string} baseUrl - URL prefix, e.g. '../api/alerting' or '/api/alerting'
 */
export const getPlugins = async (httpClient, baseUrl = '../api/alerting') => {
  try {
    const dataSourceQuery = getDataSourceQueryObj();
    const pluginsResponse = await httpClient.get(`${baseUrl}/_plugins`, dataSourceQuery);
    if (pluginsResponse.ok) {
      return pluginsResponse.resp.map((plugin) => plugin.component);
    } else {
      console.error('There was a problem getting plugins list');
      return [];
    }
  } catch (e) {
    console.error('There was a problem getting plugins list', e);
    return [];
  }
};

/**
 * Create a new monitor or workflow.
 */
export const create = async ({
  monitor,
  formikBag,
  httpClient,
  notifications,
  history,
  onSuccess,
  baseUrl = '../api/alerting',
}) => {
  const { setSubmitting } = formikBag;

  try {
    const isWorkflow = monitor.workflow_type === MONITOR_TYPE.COMPOSITE_LEVEL;
    const creationPool = isWorkflow ? 'workflows' : 'monitors';
    const dataSourceQuery = getDataSourceQueryObj();
    const resp = await httpClient.post(`${baseUrl}/${creationPool}`, {
      body: JSON.stringify(monitor),
      query: dataSourceQuery?.query,
    });

    if (resp.ok) {
      setSubmitting(false);
      const id = resp.resp._id;
      history.push(`/monitors/${id}?type=${isWorkflow ? 'workflow' : 'monitor'}`);

      if (onSuccess) {
        onSuccess({ monitor: { _id: id, ...monitor } });
      }
    } else {
      setSubmitting(false);
      backendErrorNotification(notifications, 'create', 'monitor', resp.resp);
    }
  } catch (err) {
    console.error(err);
    setSubmitting(false);
  }
};

/**
 * Update an existing monitor.
 */
export const update = async ({ history, updateMonitor, notifications, monitor, formikBag }) => {
  const { setSubmitting } = formikBag;
  const updatedMonitor = _.cloneDeep(monitor);
  try {
    const isWorkflow = updatedMonitor.workflow_type === MONITOR_TYPE.COMPOSITE_LEVEL;
    const resp = await updateMonitor(updatedMonitor);
    setSubmitting(false);
    const { ok, id } = resp;
    if (ok) {
      notifications.toasts.addSuccess(`Monitor "${monitor.name}" successfully updated.`);
      history.push(`/monitors/${id}?type=${isWorkflow ? 'workflow' : 'monitor'}`);
    } else {
      console.log('Failed to update:', resp);
    }
  } catch (err) {
    console.error(err);
    setSubmitting(false);
  }
};

/**
 * Prepare triggers for a monitor (add/update/replace).
 */
export const prepareTriggers = ({
  trigger,
  triggerMetadata,
  monitor,
  edit,
  triggerToEdit = [],
}) => {
  const { ui_metadata: uiMetadata = {}, triggers, monitor_type } = monitor;
  let updatedTriggers;
  let updatedUiMetadata;

  if (edit) {
    updatedTriggers = _.isArray(trigger) ? trigger.concat(triggers) : [trigger].concat(triggers);
    updatedUiMetadata = {
      ...uiMetadata,
      triggers: { ...uiMetadata.triggers, ...triggerMetadata },
    };
  } else {
    const updatedTriggersMetadata = _.cloneDeep(uiMetadata.triggers || {});

    let triggerType;
    switch (monitor_type) {
      case MONITOR_TYPE.BUCKET_LEVEL:
        triggerType = TRIGGER_TYPE.BUCKET_LEVEL;
        break;
      case MONITOR_TYPE.DOC_LEVEL:
        triggerType = TRIGGER_TYPE.DOC_LEVEL;
        break;
      case MONITOR_TYPE.COMPOSITE_LEVEL:
        triggerType = TRIGGER_TYPE.COMPOSITE_LEVEL;
        break;
      default:
        triggerType = TRIGGER_TYPE.QUERY_LEVEL;
        break;
    }

    if (_.isArray(triggerToEdit)) {
      const names = triggerToEdit.map((entry) => _.get(entry, `${triggerType}.name`));
      names.forEach((name) => delete updatedTriggersMetadata[name]);
      updatedTriggers = _.cloneDeep(trigger);
    } else {
      const { name } = _.get(triggerToEdit, `${triggerType}`);
      delete updatedTriggersMetadata[name];

      const findTriggerName = (element) => {
        return name === _.get(element, `${triggerType}.name`);
      };

      const indexToUpdate = _.findIndex(triggers, findTriggerName);
      updatedTriggers = triggers.slice();
      updatedTriggers.splice(indexToUpdate, 1, trigger);
    }

    updatedUiMetadata = {
      ...uiMetadata,
      triggers: { ...updatedTriggersMetadata, ...triggerMetadata },
    };
  }

  return { triggers: updatedTriggers, ui_metadata: updatedUiMetadata };
};

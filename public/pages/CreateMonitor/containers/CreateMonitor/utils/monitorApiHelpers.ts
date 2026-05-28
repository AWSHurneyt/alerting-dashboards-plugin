/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import _ from 'lodash';
import { MONITOR_TYPE } from '../../../../../utils/constants';
import { backendErrorNotification } from '../../../../../utils/helpers';
import { TRIGGER_TYPE } from '../../../../CreateTrigger/containers/CreateTrigger/utils/constants';
import { getDataSourceQueryObj } from '../../../../utils/helpers';

interface HttpClient {
  get: (url: string, options?: any) => Promise<any>;
  post: (url: string, options?: any) => Promise<any>;
}

interface FormikBag {
  setSubmitting: (isSubmitting: boolean) => void;
}

interface Notifications {
  toasts: { addSuccess: (msg: string) => void; addDanger: (msg: any) => void };
}

interface History {
  push: (path: string) => void;
}

interface CreateParams {
  monitor: any;
  formikBag: FormikBag;
  httpClient: HttpClient;
  notifications: Notifications;
  history: History;
  onSuccess?: (result: { monitor: any }) => void;
  baseUrl?: string;
}

interface UpdateParams {
  history: History;
  updateMonitor: (monitor: any) => Promise<{ ok: boolean; id: string }>;
  notifications: Notifications;
  monitor: any;
  formikBag: FormikBag;
}

interface PrepareTriggersParams {
  trigger: any;
  triggerMetadata: Record<string, any>;
  monitor: { ui_metadata?: any; triggers: any[]; monitor_type: string };
  edit: boolean;
  triggerToEdit?: any;
}

/**
 * Fetch the list of installed plugins.
 */
export const getPlugins = async (
  httpClient: HttpClient,
  baseUrl: string = '../api/alerting'
): Promise<string[]> => {
  try {
    const dataSourceQuery = getDataSourceQueryObj();
    const pluginsResponse = await httpClient.get(`${baseUrl}/_plugins`, dataSourceQuery);
    if (pluginsResponse.ok) {
      return pluginsResponse.resp.map((plugin: { component: string }) => plugin.component);
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
}: CreateParams): Promise<void> => {
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
export const update = async ({
  history,
  updateMonitor,
  notifications,
  monitor,
  formikBag,
}: UpdateParams): Promise<void> => {
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
}: PrepareTriggersParams): { triggers: any[]; ui_metadata: any } => {
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

    let triggerType: string;
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
      const names = triggerToEdit.map((entry: any) => _.get(entry, `${triggerType}.name`));
      names.forEach((name: string) => delete updatedTriggersMetadata[name]);
      updatedTriggers = _.cloneDeep(trigger);
    } else {
      const { name } = _.get(triggerToEdit, `${triggerType}`);
      delete updatedTriggersMetadata[name];

      const findTriggerName = (element: any) => {
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

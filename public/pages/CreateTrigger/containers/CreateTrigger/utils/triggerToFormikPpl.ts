/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import _ from 'lodash';
import { PplTrigger } from '../../../../../types';

interface FormikDuration {
  value: number | string;
  unit: string;
}

interface TriggerFormikPpl {
  id?: string;
  name: string;
  severity: string;
  actions: any[];
  mode: string;
  type: string;
  num_results_condition: string;
  num_results_value: number;
  custom_condition: string;
  throttle_enabled: boolean;
  suppress: FormikDuration;
  expires: FormikDuration;
}

const minutesToFormikDuration = (minutes: number | undefined | null, defaultMinutes: number = 0): FormikDuration => {
  const totalMinutes = minutes || defaultMinutes;
  if (totalMinutes >= 1440 && totalMinutes % 1440 === 0) {
    return { value: totalMinutes / 1440, unit: 'days' };
  }
  if (totalMinutes >= 60 && totalMinutes % 60 === 0) {
    return { value: totalMinutes / 60, unit: 'hours' };
  }
  return { value: totalMinutes, unit: 'minutes' };
};

export const triggerToFormikPpl = (trigger: Partial<PplTrigger> | null | undefined): TriggerFormikPpl => {
  const {
    id,
    name,
    severity,
    actions = [],
    mode,
    type,
    num_results_condition,
    num_results_value,
    custom_condition,
    throttle_minutes,
    expires_minutes,
  } = trigger || {} as Partial<PplTrigger>;

  const throttle = throttle_minutes;
  const hasThrottle = throttle !== undefined && throttle !== null;
  const suppress: FormikDuration = hasThrottle
    ? minutesToFormikDuration(throttle, 0)
    : { value: '', unit: 'minutes' };
  const expiresDuration = minutesToFormikDuration(expires_minutes, 7 * 24 * 60);

  return {
    id: id || undefined,
    name: name || '',
    severity: severity || 'info',
    actions: _.cloneDeep(actions),
    mode: mode || 'result_set',
    type: type || 'number_of_results',
    num_results_condition: num_results_condition || '>=',
    num_results_value: num_results_value !== undefined ? num_results_value : 1,
    custom_condition: custom_condition || '',
    throttle_enabled: hasThrottle && throttle !== 0,
    suppress,
    expires: expiresDuration,
  };
};

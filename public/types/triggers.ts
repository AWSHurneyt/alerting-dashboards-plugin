/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export enum TriggerType {
  QUERY_LEVEL = 'query_level_trigger',
  BUCKET_LEVEL = 'bucket_level_trigger',
  DOC_LEVEL = 'document_level_trigger',
  COMPOSITE = 'chained_alert_trigger',
  AD = 'anomaly_detector_trigger',
  PPL = 'ppl_trigger',
}

export interface TriggerAction {
  id?: string;
  name: string;
  destination_id: string;
  message_template: { source: string; lang?: string };
  subject_template?: { source: string; lang?: string };
  throttle_enabled?: boolean;
  throttle?: { value: number; unit: string };
}

export interface TriggerConditionScript {
  source: string;
  lang?: string;
}

export interface QueryLevelTrigger {
  id?: string;
  name: string;
  severity: string;
  condition: { script: TriggerConditionScript };
  actions: TriggerAction[];
  min_time_between_executions?: number | null;
  rolling_window_size?: number | null;
}

export interface BucketLevelTrigger {
  id?: string;
  name: string;
  severity: string;
  condition: { script: TriggerConditionScript; buckets_path?: Record<string, string> };
  actions: TriggerAction[];
  min_time_between_executions?: number | null;
  rolling_window_size?: number | null;
}

export interface DocLevelTrigger {
  id?: string;
  name: string;
  severity: string;
  condition: { script: TriggerConditionScript };
  actions: TriggerAction[];
  min_time_between_executions?: number | null;
  rolling_window_size?: number | null;
}

export interface PplTrigger {
  id?: string;
  name: string;
  severity: string;
  actions: TriggerAction[];
  mode: 'result_set' | 'per_execution' | string;
  type: 'number_of_results' | 'custom_condition' | string;
  num_results_condition?: string | null;
  num_results_value?: number | null;
  custom_condition?: string | null;
  throttle_minutes?: number;
  expires_minutes?: number;
}

/** A trigger as stored in the monitor — wrapped in its type key */
export type Trigger =
  | { query_level_trigger: QueryLevelTrigger }
  | { bucket_level_trigger: BucketLevelTrigger }
  | { document_level_trigger: DocLevelTrigger }
  | { chained_alert_trigger: QueryLevelTrigger }
  | { ppl_trigger: PplTrigger };

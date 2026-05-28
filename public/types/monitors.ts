/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export enum MonitorType {
  QUERY_LEVEL = 'query_level_monitor',
  BUCKET_LEVEL = 'bucket_level_monitor',
  CLUSTER_METRICS = 'cluster_metrics_monitor',
  DOC_LEVEL = 'doc_level_monitor',
  COMPOSITE = 'composite',
  PPL = 'ppl_monitor',
}

export interface MonitorSchedulePeriod {
  interval: number;
  unit: 'MINUTES' | 'HOURS' | 'DAYS';
}

export interface MonitorScheduleCron {
  expression: string;
  timezone: string;
}

export interface MonitorSchedule {
  period?: MonitorSchedulePeriod;
  cron?: MonitorScheduleCron;
}

export interface MonitorSearchInput {
  indices: string[];
  query: Record<string, unknown>;
}

export interface MonitorInput {
  search?: MonitorSearchInput;
  uri?: { path: string; clusters?: string[] };
  doc_level_input?: { description: string; indices: string[]; queries: DocLevelQuery[] };
  composite_input?: { sequence: { delegates: Array<{ monitor_id: string }> } };
  ppl?: { query: string };
}

export interface DocLevelQuery {
  id: string;
  name: string;
  query: string;
  tags: string[];
}

export interface MonitorUiMetadata {
  search?: { searchType: string; aggregationType?: string; fieldName?: string };
  triggers?: Record<string, unknown>;
  schedule?: Record<string, unknown>;
  lookback?: {
    enabled: boolean;
    minutes?: number;
    amount?: number;
    unit?: string;
    timestamp_field?: string;
  };
}

export interface Monitor {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  enabled: boolean;
  monitor_type: MonitorType | string;
  schedule: MonitorSchedule;
  inputs: MonitorInput[];
  triggers: Trigger[];
  ui_metadata?: MonitorUiMetadata;
  last_update_time?: number;
  enabled_time?: number;
  schema_version?: number;
  workflow_type?: string;
}

export interface PplMonitor {
  name: string;
  description?: string;
  enabled: boolean;
  schedule: MonitorSchedule;
  query: string;
  triggers: PplTrigger[];
  look_back_window_minutes?: number | null;
  timestamp_field?: string | null;
  ui_metadata?: MonitorUiMetadata;
  last_update_time?: number;
  query_language?: string;
}

export interface MonitorWithPpl extends Monitor {
  ppl_monitor?: PplMonitor;
  look_back_window_minutes?: number | null;
  timestamp_field?: string | null;
}

// Re-export trigger types for convenience
export type { Trigger, PplTrigger } from './triggers';

/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { MonitorType, MonitorSchedule } from './monitors';

export interface ComboBoxOption {
  label: string;
  value?: string;
  type?: string;
}

export interface MonitorFormikValues {
  name: string;
  description?: string;
  disabled: boolean;
  monitor_type: MonitorType | string;
  searchType: string;
  index: ComboBoxOption[];
  timeField?: string;
  frequency: string;
  period?: { interval: number; unit: string };
  daily?: string;
  weekly?: Record<string, boolean>;
  monthly?: { type: string; day: number };
  cronExpression?: string;
  timezone?: ComboBoxOption[] | string;

  // Query monitor fields
  query?: string;
  aggregationType?: string;
  fieldName?: ComboBoxOption[];
  bucketValue?: number;
  bucketUnitOfTime?: string;
  groupBy?: string[];
  overDocuments?: string;
  groupedOverTop?: number;
  groupedOverFieldName?: string;

  // PPL monitor fields
  pplQuery?: string;
  monitor_mode?: 'ppl' | 'legacy';
  useLookBackWindow?: boolean;
  lookBackAmount?: number;
  lookBackUnit?: string;
  timestampField?: string;

  // AD monitor fields
  detectorId?: string;
  adResultIndex?: string;

  // Trigger definitions
  triggerDefinitions: TriggerFormikValues[];

  // Data source
  dataSourceId?: string;

  // UI metadata
  ui_metadata?: Record<string, unknown>;
}

export interface TriggerFormikValues {
  id?: string;
  name: string;
  severity: string;
  script?: { source: string; lang?: string };
  actions: ActionFormikValues[];
  thresholdValue?: number;
  thresholdEnum?: string;

  // PPL trigger fields
  type?: string;
  mode?: string;
  num_results_condition?: string;
  num_results_value?: number;
  custom_condition?: string;
  throttle_enabled?: boolean;
  suppress?: { value: number | string; unit: string };
  expires?: { value: number; unit: string };

  // AD trigger fields
  anomalyDetector?: {
    anomalyGradeThresholdValue: number;
    anomalyGradeThresholdEnum: string;
    anomalyConfidenceThresholdValue: number;
    anomalyConfidenceThresholdEnum: string;
  };
}

export interface ActionFormikValues {
  id?: string;
  name: string;
  destination_id: string;
  message_template: { source: string };
  subject_template?: { source: string };
  throttle_enabled?: boolean;
  throttle?: { value: number; unit: string };
}

export interface DestinationFormikValues {
  name: string;
  type: string;
  slack?: { url: string };
  chime?: { url: string };
  custom_webhook?: {
    url?: string;
    urlType?: string;
    scheme?: string;
    host?: string;
    port?: number | null;
    path?: string;
    method?: string;
    queryParams?: Array<{ key: string; value: string }>;
    headerParams?: Array<{ key: string; value: string }>;
  };
  email?: {
    emailSender: ComboBoxOption[];
    emailRecipients: ComboBoxOption[];
  };
}

/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { Monitor, MonitorWithPpl } from './monitors';
import { Alert } from './alerts';
import { Destination } from './destinations';

export interface ApiResponse<T = unknown> {
  ok: boolean;
  resp?: T;
}

export interface GetMonitorResponse extends ApiResponse<Monitor | MonitorWithPpl> {
  version?: number;
  ifSeqNo?: number;
  ifPrimaryTerm?: number;
  dayCount?: number;
  activeCount?: number;
}

export interface CreateMonitorResponse extends ApiResponse<{ _id: string }> {}

export interface UpdateMonitorResponse extends ApiResponse {
  version?: number;
  id?: string;
  ifSeqNo?: number;
  ifPrimaryTerm?: number;
}

export interface GetAlertsResponse extends ApiResponse {
  alerts: Alert[];
  totalAlerts: number;
}

export interface GetDestinationsResponse extends ApiResponse {
  destinations: Destination[];
  totalDestinations: number;
}

export interface SearchDetectorsResponse extends ApiResponse {
  ok: boolean;
  detectors: Array<{
    id: string;
    name: string;
    featureAttributes: Array<{ featureId: string; featureName: string; featureEnabled: boolean }>;
    detectionInterval: { period: { interval: number; unit: string } };
    resultIndex?: string;
    detectionDateRange?: unknown;
    categoryField?: string[];
  }>;
}

export interface GetChannelsResponse extends ApiResponse {
  channel_list: Array<{
    config_id: string;
    name: string;
    config_type: string;
    is_enabled: boolean;
  }>;
  total_hits: number;
}

export interface RunPplPreviewResponse {
  ok?: boolean;
  schema?: Array<{ name: string; type: string }>;
  datarows?: unknown[][];
  error?: string;
}

export interface GetPluginsResponse extends ApiResponse {
  resp: Array<{ component: string }>;
}

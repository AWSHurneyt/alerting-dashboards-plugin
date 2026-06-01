/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export { TriggerAction } from './triggers';

export interface ActionThrottle {
  value: number;
  unit: 'MINUTES' | 'HOURS' | 'DAYS';
}

export interface MessageTemplate {
  source: string;
  lang?: string;
}

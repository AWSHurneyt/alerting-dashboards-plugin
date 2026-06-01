/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

// Re-export and extend the existing Alert interface from models/interfaces.ts
export type { Alert } from '../models/interfaces';

export enum AlertState {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
  DELETED = 'DELETED',
}

export interface AlertSummary {
  activeCount: number;
  acknowledgedCount: number;
  completedCount: number;
  errorCount: number;
}

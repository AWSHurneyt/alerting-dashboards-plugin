/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export enum DestinationType {
  SLACK = 'slack',
  CHIME = 'chime',
  CUSTOM_WEBHOOK = 'custom_webhook',
  EMAIL = 'email',
}

export interface SlackDestination {
  url: string;
}

export interface ChimeDestination {
  url: string;
}

export interface CustomWebhookDestination {
  url?: string;
  scheme?: string;
  host?: string;
  port?: number | null;
  path?: string;
  method?: string;
  query_params?: Record<string, string>;
  header_params?: Record<string, string>;
}

export interface EmailRecipient {
  type: 'email' | 'email_group';
  email?: string;
  email_group_id?: string;
}

export interface EmailDestination {
  email_account_id: string;
  recipients: EmailRecipient[];
}

export interface Destination {
  id?: string;
  name: string;
  type: DestinationType | string;
  schema_version?: number;
  last_update_time?: number;
  slack?: SlackDestination;
  chime?: ChimeDestination;
  custom_webhook?: CustomWebhookDestination;
  email?: EmailDestination;
}

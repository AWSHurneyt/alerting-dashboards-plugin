/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

jest.mock('./constants', () => ({
  URL_TYPE: { FULL_URL: 'full_url', ATTRIBUTE_URL: 'attribute_url' },
  CONTENT_TYPE_KEY: 'Content-Type',
}));
jest.mock('../../../utils/constants', () => ({
  DESTINATION_TYPE: {
    SLACK: 'slack',
    CHIME: 'chime',
    CUSTOM_HOOK: 'custom_webhook',
    EMAIL: 'email',
  },
}));
jest.mock('../EmailRecipients/utils/constants', () => ({
  RECIPIENT_TYPE: { EMAIL: 'email', EMAIL_GROUP: 'email_group' },
}));
jest.mock('../../../../utils/helpers', () => ({
  getDataSourceQueryObj: jest.fn(() => null),
}));

import { destinationToFormik } from './destinationToFormik';

describe('destinationToFormik', () => {
  const httpClient = {
    get: jest.fn().mockResolvedValue({ ok: true, resp: { name: 'sender1' } }),
  };

  test('converts slack destination (passthrough)', async () => {
    const values = {
      id: '1',
      version: 1,
      type: 'slack',
      name: 'My Slack',
      slack: { url: 'https://hooks.slack.com/xxx' },
    };
    const result = await destinationToFormik(httpClient, values);
    expect(result.name).toBe('My Slack');
    expect(result.slack.url).toBe('https://hooks.slack.com/xxx');
    expect(result.id).toBeUndefined();
    expect(result.version).toBeUndefined();
  });

  test('converts custom_webhook destination', async () => {
    const values = {
      id: '2',
      version: 1,
      type: 'custom_webhook',
      name: 'My Hook',
      custom_webhook: {
        url: 'https://example.com',
        port: 443,
        query_params: { token: 'abc' },
        header_params: { 'Content-Type': 'application/json', 'X-Custom': 'val' },
      },
    };
    const result = await destinationToFormik(httpClient, values);
    expect(result.custom_webhook.url).toBe('https://example.com');
    expect(result.custom_webhook.urlType).toBe('full_url');
    expect(result.custom_webhook.queryParams).toEqual([{ key: 'token', value: 'abc' }]);
    expect(result.custom_webhook.headerParams[0]).toEqual({
      key: 'Content-Type',
      value: 'application/json',
    });
  });

  test('converts email destination', async () => {
    const values = {
      id: '3',
      version: 1,
      type: 'email',
      name: 'My Email',
      email: {
        email_account_id: 'sender-1',
        recipients: [{ type: 'email', email: 'test@example.com' }],
      },
    };
    const result = await destinationToFormik(httpClient, values);
    expect(result.email.emailSender).toEqual([{ label: 'sender1', value: 'sender-1' }]);
    expect(result.email.emailRecipients[0].label).toBe('test@example.com');
  });

  test('handles port -1 as null', async () => {
    const values = {
      id: '4',
      version: 1,
      type: 'custom_webhook',
      name: 'Hook',
      custom_webhook: {
        url: '',
        port: -1,
        query_params: {},
        header_params: { 'Content-Type': 'text/plain' },
      },
    };
    const result = await destinationToFormik(httpClient, values);
    expect(result.custom_webhook.port).toBeNull();
    expect(result.custom_webhook.urlType).toBe('attribute_url');
  });
});

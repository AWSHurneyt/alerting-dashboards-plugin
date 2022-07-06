/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { API } from './constants';
import sampleWebhookNotificationChannel from '../fixtures/sample_notification_channel_custom_webhook.json';

const SAMPLE_NOTIFICATION_CHANNEL = sampleWebhookNotificationChannel.config.name;

export async function hasPlugin(pluginName) {
  try {
    const resp = await cy.request('GET', `${Cypress.env('opensearch')}/_cat/plugins?format=json`);
    if (resp.isOkStatusCode) {
      const matchingPlugins = resp.body.filter((plugin) => plugin.component === pluginName);
      if (matchingPlugins.length > 1)
        cy.log('More than one matching plugin found: ', matchingPlugins);
      return matchingPlugins.length > 0;
    } else {
      cy.log('Error occurred while retrieving enabled plugins: ', resp);
      return false;
    }
  } catch (e) {
    cy.log('Exception occurred while retrieving enabled plugins: ', e);
  }
  return false;
}

export function deleteNotificationChannelByName(channelName) {
  try {
    cy.request('GET', `${Cypress.env('opensearch')}${API.NOTIFICATIONS_BASE}`).then((resp) => {
      if (resp.isOkStatusCode) {
        const matchingChannelId = resp.body.config_list
          .filter((config) => config.config.name === channelName)
          .map((config) => config.config_id);
        matchingChannelId.forEach((configId) => {
          cy.request('DELETE', `${Cypress.env('opensearch')}${API.NOTIFICATIONS_BASE}/${configId}`);
        });
      } else {
        cy.log('Error occurred while retrieving notification channel configs: ', resp);
      }
    });
  } catch (e) {
    cy.log(`Exception occurred while deleting notification channel ${channelName}: `, e);
  }
}

export function addActionToTrigger(actionIndex = 0, triggerIndex = 0, triggerName = 'triggerName') {
  console.info(`hurneyt addActionToTrigger actionIndex = ${actionIndex}`);
  console.info(`hurneyt addActionToTrigger triggerIndex = ${triggerIndex}`);
  console.info(`hurneyt addActionToTrigger triggerName = ${triggerName}`);

  // Type in the action name
  cy.get(
    `input[name="triggerDefinitions[${triggerIndex}].actions.${actionIndex}.name"]`
  ).type(`${triggerName}-${triggerIndex}-action-${actionIndex}`, { force: true });

  // Click the combo box to list all the destinations
  // Using key typing instead of clicking the menu option to avoid occasional failure
  cy.get(`div[name="triggerDefinitions[${triggerIndex}].actions.${actionIndex}.destination_id"]`)
    .click({ force: true })
    .type(`${SAMPLE_NOTIFICATION_CHANNEL}{downarrow}{enter}`);
}

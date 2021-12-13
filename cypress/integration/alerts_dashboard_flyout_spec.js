/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import React from 'react';
import { INDEX, PLUGIN_NAME } from '../support/constants';
import sampleAlertsFlyoutBucketMonitor from '../fixtures/sample_alerts_flyout_bucket_level_monitor.json';
import sampleAlertsFlyoutQueryMonitor from '../fixtures/sample_alerts_flyout_query_level_monitor.json';

const BUCKET_MONITOR = 'sample_alerts_flyout_bucket_level_monitor';
const BUCKET_TRIGGER = 'sample_alerts_flyout_bucket_level_trigger';
const QUERY_MONITOR = 'sample_alerts_flyout_query_level_monitor';
const QUERY_TRIGGER = 'sample_alerts_flyout_query_level_trigger';

describe('Alerts by trigger flyout', () => {
  before(() => {
    // Delete any existing monitors
    cy.deleteAllMonitors();

    // Load sample data
    cy.loadSampleEcommerceData();

    // Create the test monitors
    cy.createMonitor(sampleAlertsFlyoutBucketMonitor);
    cy.createMonitor(sampleAlertsFlyoutQueryMonitor);
    cy.wait(10000);

    // Visit Alerting OpenSearch Dashboards
    cy.visit(`${Cypress.env('opensearch_dashboards')}/app/${PLUGIN_NAME}#/monitors`);

    // Confirm test monitors were created successfully
    cy.contains(BUCKET_MONITOR);
    cy.contains(QUERY_MONITOR);

    // Wait 1.5 minute for the test monitors to trigger alerts, then go to the 'Alerts by trigger' dashboard page to view alerts
    cy.wait(90000);
    cy.visit(`${Cypress.env('opensearch_dashboards')}/app/${PLUGIN_NAME}#/dashboard`);
  });

  beforeEach(() => {
    // Reloading the page to close any flyouts that were not closed by other tests that had failures.
    cy.reload();
    cy.wait(10000);
  });

  it('Bucket-level monitor flyout test', () => {
    // Click the link for the flyout.
    cy.get(`[data-test-subj="euiLink_${BUCKET_TRIGGER}"]`).click();

    // Wait for the flyout to load the trigger-specific alerts.
    cy.wait(10000);

    // Perform the test checks within the flyout component.
    cy.get(`[data-test-subj="alertsDashboardFlyout_${BUCKET_TRIGGER}"]`).within(() => {
      // Confirm flyout header contains expected text.
      cy.get(`[data-test-subj="alertsDashboardFlyout_header_${BUCKET_TRIGGER}"]`).contains(
        `Alerts by ${BUCKET_TRIGGER}`
      );

      // Confirm 'Trigger name' sections renders as expected.
      cy.get(`[data-test-subj="alertsDashboardFlyout_triggerName_${BUCKET_TRIGGER}"]`).contains(
        'Trigger name'
      );
      cy.get(`[data-test-subj="alertsDashboardFlyout_triggerName_${BUCKET_TRIGGER}"]`).contains(
        BUCKET_TRIGGER
      );

      // Confirm 'Severity' sections renders as expected.
      cy.get(`[data-test-subj="alertsDashboardFlyout_severity_${BUCKET_TRIGGER}"]`).contains(
        'Severity'
      );
      cy.get(`[data-test-subj="alertsDashboardFlyout_severity_${BUCKET_TRIGGER}"]`).contains(
        '4 (Low)'
      );

      // Confirm 'Monitor' sections renders as expected.
      cy.get(`[data-test-subj="alertsDashboardFlyout_monitor_${BUCKET_TRIGGER}"]`).contains(
        'Monitor'
      );
      cy.get(`[data-test-subj="alertsDashboardFlyout_monitor_${BUCKET_TRIGGER}"]`).contains(
        BUCKET_MONITOR
      );

      // Confirm 'Conditions' sections renders as expected.
      cy.get(`[data-test-subj="alertsDashboardFlyout_conditions_${BUCKET_TRIGGER}"]`).contains(
        'Conditions'
      );

      // Confirm the 'Conditions' sections renders with all of the expected conditions.
      ['params._count < 10000', 'OR', 'params.avg_products_price == 10'].forEach((entry) =>
        cy
          .get(`[data-test-subj="alertsDashboardFlyout_conditions_${BUCKET_TRIGGER}"]`)
          .contains(entry)
      );

      // Confirm 'Time range for the last' sections renders as expected.
      cy.get(`[data-test-subj="alertsDashboardFlyout_timeRange_${BUCKET_TRIGGER}"]`).contains(
        'Time range for the last'
      );
      cy.get(`[data-test-subj="alertsDashboardFlyout_timeRange_${BUCKET_TRIGGER}"]`).contains(
        '10 day(s)'
      );

      // Confirm 'Filters' sections renders as expected.
      cy.get(`[data-test-subj="alertsDashboardFlyout_filters_${BUCKET_TRIGGER}"]`).contains(
        'Filters'
      );
      cy.get(`[data-test-subj="alertsDashboardFlyout_filters_${BUCKET_TRIGGER}"]`).contains(
        'All fields are included'
      );

      // Confirm 'Group by' sections renders as expected.
      cy.get(`[data-test-subj="alertsDashboardFlyout_groupBy_${BUCKET_TRIGGER}"]`).contains(
        'Group by'
      );
      cy.get(`[data-test-subj="alertsDashboardFlyout_groupBy_${BUCKET_TRIGGER}"]`).contains(
        'customer_gender, user'
      );

      // Set the 'severity' filter to only display ACTIVE alerts.
      cy.get('[data-test-subj="dashboardAlertStateFilter"]').select('Active');
      cy.wait(10000);

      // This monitor configuration consistently returns 46 alerts when testing locally.
      // Confirm the flyout dashboard contains more than 1 ACTIVE alert.
      cy.get('tbody > tr').should(($tr) => expect($tr).to.have.length.greaterThan(1));

      // Select the first and last alerts in the table.
      cy.get('input[data-test-subj^="checkboxSelectRow-"]').first().click();
      cy.get('input[data-test-subj^="checkboxSelectRow-"]').last().click();

      // Press the flyout 'Acknowledge button, and wait for the AcknowledgeAlerts API call to complete.
      cy.get('[data-test-subj="flyoutAcknowledgeAlertsButton"]').click();
    });

    // Confirm acknowledge alerts toast displays expected text.
    cy.contains('Successfully acknowledged 2 alerts.');

    // Confirm alerts were acknowledged as expected.
    cy.get(`[data-test-subj="alertsDashboardFlyout_${BUCKET_TRIGGER}"]`).within(() => {
      // Wait for GetAlerts API call to complete.
      cy.wait(10000);

      // Set the 'severity' filter to only display ACKNOWLEDGED alerts.
      cy.get('[data-test-subj="dashboardAlertStateFilter"]').select('Acknowledged');
      cy.wait(10000);

      // Confirm the table displays 2 acknowledged alerts.
      cy.get('tbody > tr').should(($tr) => expect($tr).to.have.length(2));
    });

    // Confirm close button hides the flyout.
    cy.get(`[data-test-subj="alertsDashboardFlyout_closeButton_${BUCKET_TRIGGER}"]`).click();
    cy.contains(`[data-test-subj="alertsDashboardFlyout_${BUCKET_TRIGGER}"]`).should('not.exist');
  });

  it('Query-level monitor flyout test', () => {
    // Click the link for the flyout.
    cy.get(`[data-test-subj="euiLink_${QUERY_TRIGGER}"]`).click();

    // Wait for the flyout to load the trigger-specific alerts.
    cy.wait(10000);

    // Perform the test checks within the flyout component.
    cy.get(`[data-test-subj="alertsDashboardFlyout_${QUERY_TRIGGER}"]`).within(() => {
      // Confirm flyout header contains expected text.
      cy.get(`[data-test-subj="alertsDashboardFlyout_header_${QUERY_TRIGGER}"]`).contains(
        `Alerts by ${QUERY_TRIGGER}`
      );

      // Confirm 'Trigger name' sections renders as expected.
      cy.get(`[data-test-subj="alertsDashboardFlyout_triggerName_${QUERY_TRIGGER}"]`).contains(
        'Trigger name'
      );
      cy.get(`[data-test-subj="alertsDashboardFlyout_triggerName_${QUERY_TRIGGER}"]`).contains(
        QUERY_TRIGGER
      );

      // Confirm 'Severity' sections renders as expected.
      cy.get(`[data-test-subj="alertsDashboardFlyout_severity_${QUERY_TRIGGER}"]`).contains(
        'Severity'
      );
      cy.get(`[data-test-subj="alertsDashboardFlyout_severity_${QUERY_TRIGGER}"]`).contains(
        '2 (High)'
      );

      // Confirm 'Monitor' sections renders as expected.
      cy.get(`[data-test-subj="alertsDashboardFlyout_monitor_${QUERY_TRIGGER}"]`).contains(
        'Monitor'
      );
      cy.get(`[data-test-subj="alertsDashboardFlyout_monitor_${QUERY_TRIGGER}"]`).contains(
        QUERY_MONITOR
      );

      // Confirm 'Conditions' sections renders as expected.
      cy.get(`[data-test-subj="alertsDashboardFlyout_conditions_${QUERY_TRIGGER}"]`).contains(
        'Condition'
      );
      cy.get(`[data-test-subj="alertsDashboardFlyout_conditions_${QUERY_TRIGGER}"]`).contains(
        `ctx.results[0].hits.total.value < 10000`
      );

      // Confirm 'Time range for the last' sections renders as expected.
      cy.get(`[data-test-subj="alertsDashboardFlyout_timeRange_${QUERY_TRIGGER}"]`).contains(
        'Time range for the last'
      );
      cy.get(`[data-test-subj="alertsDashboardFlyout_timeRange_${QUERY_TRIGGER}"]`).contains(
        '10 day(s)'
      );

      // Confirm 'Filters' sections renders as expected.
      cy.get(`[data-test-subj="alertsDashboardFlyout_filters_${QUERY_TRIGGER}"]`).contains(
        'Filters'
      );
      cy.get(`[data-test-subj="alertsDashboardFlyout_filters_${QUERY_TRIGGER}"]`).contains('-');

      // Confirm 'Group by' sections renders as expected.
      cy.get(`[data-test-subj="alertsDashboardFlyout_groupBy_${QUERY_TRIGGER}"]`).contains(
        'Group by'
      );
      cy.get(`[data-test-subj="alertsDashboardFlyout_groupBy_${QUERY_TRIGGER}"]`).contains('user');

      // Set the 'severity' filter to only display ACTIVE alerts.
      cy.get('[data-test-subj="dashboardAlertStateFilter"]').select('Active');
      cy.wait(10000);

      // Confirm the flyout dashboard contains 1 alert.
      cy.get('tbody > tr').should(($tr) => expect($tr).to.have.length(1));

      // Select the alert.
      cy.get('input[data-test-subj^="checkboxSelectRow-"]').first().click();

      // Press the flyout 'Acknowledge button, and wait for the AcknowledgeAlerts API call to complete.
      cy.get('[data-test-subj="flyoutAcknowledgeAlertsButton"]').click();
    });

    // Confirm acknowledge alerts toast displays expected text.
    cy.contains('Successfully acknowledged 1 alert.');

    // Confirm alerts were acknowledged as expected.
    cy.get(`[data-test-subj="alertsDashboardFlyout_${QUERY_TRIGGER}"]`).within(() => {
      // Wait for GetAlerts API call to complete.
      cy.wait(10000);

      // Set the 'severity' filter to only display ACKNOWLEDGED alerts.
      cy.get('[data-test-subj="dashboardAlertStateFilter"]').select('Acknowledged');
      cy.wait(10000);

      // Confirm the table displays 1 acknowledged alert.
      cy.get('tbody > tr').should(($tr) => expect($tr).to.have.length(1));
    });

    // Confirm close button hides the flyout.
    cy.get(`[data-test-subj="alertsDashboardFlyout_closeButton_${QUERY_TRIGGER}"]`).click();
    cy.contains(`[data-test-subj="alertsDashboardFlyout_${QUERY_TRIGGER}"]`).should('not.exist');
  });

  after(() => {
    // Delete all monitors
    cy.deleteAllMonitors();

    // Delete sample data
    cy.deleteIndexByName(`${INDEX.SAMPLE_DATA_ECOMMERCE}`);
  });
});
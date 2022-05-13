/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { PLUGIN_NAME } from '../support/constants';
import sampleDocumentLevelMonitor from '../fixtures/sample_document_level_monitor.json';

const TESTING_INDEX = 'document-level-monitor-test-index';
const SAMPLE_EXTRACTION_QUERY_MONITOR = 'sample_extraction_query_document_level_monitor';
const SAMPLE_VISUAL_EDITOR_MONITOR = 'sample_visual_editor_document_level_monitor';
const SAMPLE_DOCUMENT_LEVEL_MONITOR = 'sample_document_level_monitor';

const addDocumentsToTestIndex = (indexName = '', numOfDocs = 0) => {
  for (let i = 0; i < numOfDocs; i++) {
    const docBody = {
      message: 'This is an error from IAD region',
      date: '2020-06-04T18:57:12',
      region: 'us-west-2',
    };
    cy.insertDocumentToIndex(indexName, undefined, docBody);
  }
};

describe('DocumentLevelMonitor', () => {
  before(() => {
    // Load sample data
    cy.createIndexByName(TESTING_INDEX);
    addDocumentsToTestIndex(TESTING_INDEX, 5);
  });
  beforeEach(() => {
    // Set welcome screen tracking to false
    localStorage.setItem('home:welcome:show', 'false');

    // Visit Alerting OpenSearch Dashboards
    cy.visit(`${Cypress.env('opensearch_dashboards')}/app/${PLUGIN_NAME}#/monitors`);

    // Common text to wait for to confirm page loaded, give up to 20 seconds for initial load
    cy.contains('Create monitor', { timeout: 20000 });
  });

  describe('can be created', () => {
    beforeEach(() => {
      // Delete existing monitors
      cy.deleteAllMonitors();
      cy.reload();

      // Confirm empty monitor list is loaded
      cy.contains('There are no existing monitors');

      // Go to create monitor page
      cy.contains('Create monitor').click();

      // Select the Document-Level Monitor type
      cy.get('[data-test-subj="docLevelMonitorRadioCard"]').click();
    });

    it('by extraction query editor', () => {
      // Select extraction query for method of definition
      cy.get('[data-test-subj="extractionQueryEditorRadioCard"]').click();

      // Wait for input to load and then type in the monitor name
      cy.get('input[name="name"]').type(SAMPLE_EXTRACTION_QUERY_MONITOR);

      // Wait for input to load and then type in the index name
      cy.get('#index').type(`${TESTING_INDEX}{enter}`, { force: true });

      // Input extraction query
      cy.get('[data-test-subj="extractionQueryCodeEditor"]').within(() => {
        cy.get('.ace_text-input')
          .focus()
          .clear({ force: true })
          .type(JSON.stringify(sampleDocumentLevelMonitor.inputs[0].doc_level_input), {
            force: true,
            parseSpecialCharSequences: false,
            delay: 5,
            timeout: 20000,
          })
          .trigger('blur', { force: true });
      });

      // Add a trigger
      cy.contains('Add trigger').click({ force: true });

      // Type in the trigger name
      cy.get('input[name="triggerDefinitions[0].name"]').type(
        sampleDocumentLevelMonitor.triggers[0].document_level_trigger.name
      );

      // Clear the default trigger condition source, and type the sample source
      cy.get('[data-test-subj="triggerQueryCodeEditor"]').within(() => {
        cy.get('.ace_text-input')
          .focus()
          .clear({ force: true })
          .type(
            JSON.stringify(
              sampleDocumentLevelMonitor.triggers[0].document_level_trigger.condition.script.source
            ),
            {
              force: true,
              parseSpecialCharSequences: false,
              delay: 5,
              timeout: 20000,
            }
          )
          .trigger('blur', { force: true });
      });

      // TODO: Test with Notifications plugin

      // Click the create button
      cy.get('button').contains('Create').click();

      // Confirm we can see only one row in the trigger list by checking <caption> element
      cy.contains('This table contains 1 row');

      // Confirm we can see the new trigger
      cy.contains(sampleDocumentLevelMonitor.triggers[0].document_level_trigger.name);

      // Go back to the Monitors list
      cy.get('a').contains('Monitors').click();

      // Confirm we can see the created monitor in the list
      cy.contains(SAMPLE_EXTRACTION_QUERY_MONITOR);
    });

    it('by visual editor', () => {
      // Select visual editor for method of definition
      cy.get('[data-test-subj="visualEditorRadioCard"]').click();

      // Wait for input to load and then type in the monitor name
      cy.get('input[name="name"]').type(SAMPLE_VISUAL_EDITOR_MONITOR);

      // Wait for input to load and then type in the index name
      cy.get('#index').type(`${TESTING_INDEX}{enter}`, { force: true });

      // Enter query name
      cy.get('[data-test-subj="documentLevelQuery_queryName0"]').type(
        sampleDocumentLevelMonitor.inputs[0].doc_level_input.queries[0].name
      );

      // Enter query field
      cy.get('[data-test-subj="documentLevelQuery_field0"]').type('region{downarrow}{enter}');

      // Enter query operator
      cy.get('[data-test-subj="documentLevelQuery_operator0"]').type('is{enter}');

      // Enter query
      cy.get('[data-test-subj="documentLevelQuery_query0"]').type('us-west-2');

      // Enter query tags
      cy.get('[data-test-subj="addDocLevelQueryTagButton_query0"]').click();
      cy.get('[data-test-subj="documentLevelQueryTag_text_field_query0_tag0"]').type(
        sampleDocumentLevelMonitor.inputs[0].doc_level_input.queries[0].tags[0]
      );

      // Add a trigger
      cy.contains('Add trigger').click({ force: true });

      // Type in the trigger name
      cy.get('input[name="triggerDefinitions[0].name"]').type(
        sampleDocumentLevelMonitor.triggers[0].document_level_trigger.name
      );

      // Define the first condition
      cy.get(
        '[data-test-subj="documentLevelTriggerExpression_query_triggerDefinitions[0].triggerConditions.0"]'
      ).type(sampleDocumentLevelMonitor.inputs[0].doc_level_input.queries[0].tags[0]);

      // Add another condition
      cy.get('[data-test-subj="addTriggerConditionButton"]').click();

      // Define a second condition
      cy.get(
        '[data-test-subj="documentLevelTriggerExpression_andOr_triggerDefinitions[0].triggerConditions.1"]'
      ).type('or{enter}');

      cy.get(
        '[data-test-subj="documentLevelTriggerExpression_query_triggerDefinitions[0].triggerConditions.1"]'
      ).type(sampleDocumentLevelMonitor.inputs[0].doc_level_input.queries[0].tags[0]);

      // TODO: Test with Notifications plugin

      // Click the create button
      cy.get('button').contains('Create').click();

      // Confirm we can see only one row in the trigger list by checking <caption> element
      cy.contains('This table contains 1 row');

      // Confirm we can see the new trigger
      cy.contains(sampleDocumentLevelMonitor.triggers[0].document_level_trigger.name);

      // Go back to the Monitors list
      cy.get('a').contains('Monitors').click();

      // Confirm we can see the created monitor in the list
      cy.contains(SAMPLE_VISUAL_EDITOR_MONITOR);
    });
  });

  describe('can be updated', () => {
    beforeEach(() => {
      cy.deleteAllMonitors();
    });

    // todo hurney
    describe('when defined by visual editor', () => {});
  });

  after(() => {
    // Delete all monitors and destinations
    cy.deleteAllMonitors();

    // Delete sample data
    cy.deleteIndexByName(TESTING_INDEX);
  });
});

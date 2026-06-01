/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

// CreateNew cannot be unit tested in isolation due to deep coupling with OSD core plugins.
// Even with moduleNameMapper mocking embeddable/visualizations/vis_augmenter, the component's
// transitive import chain (formikToMonitor → full monitor creation utils, Schedule components,
// etc.) causes jest worker OOM. The component is tested via:
// - Container.test.js (which mocks CreateNew as a child)
// - Cypress integration tests
// Candidate for refactoring in Phase 8 to reduce coupling.
describe.skip('CreateNew', () => {
  test('renders', () => {});
});

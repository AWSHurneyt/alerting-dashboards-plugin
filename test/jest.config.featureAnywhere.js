/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 *
 * Separate jest config for FeatureAnywhereContextMenu tests that require
 * mocking OSD core plugin imports (embeddable, visualizations, vis_augmenter).
 * These mocks break other tests that legitimately import from those paths,
 * so they are isolated to this config.
 *
 * Usage: npx jest --config ./test/jest.config.featureAnywhere.js
 */

const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  testMatch: ['**/FeatureAnywhereContextMenu/**/*.test.{js,ts,tsx}'],
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '.*/src/plugins/embeddable/public.*': '<rootDir>/test/mocks/embeddableMock.js',
    '.*/src/plugins/vis_augmenter/public.*': '<rootDir>/test/mocks/visAugmenterMock.js',
    '.*/src/plugins/visualizations/public.*': '<rootDir>/test/mocks/visualizationsMock.js',
  },
};

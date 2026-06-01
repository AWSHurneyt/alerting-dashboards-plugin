/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 *
 * Custom jest environment that patches the @tootallnate/once ESM incompatibility
 * before jsdom loads. This allows jest tests to run with jsdom despite the
 * http-proxy-agent dependency requiring an ESM-only module.
 */

const path = require('path');
const Module = require('module');

// Patch Module._resolveFilename to redirect @tootallnate/once to our CJS shim
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request === '@tootallnate/once') {
    return path.resolve(__dirname, 'mocks', 'tootallnateMock.js');
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

// Now require the real jsdom environment (which will use our patched resolve)
const JsDomEnvironment = require('jest-environment-jsdom');

module.exports = JsDomEnvironment;

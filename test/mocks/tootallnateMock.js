/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 *
 * CJS shim for @tootallnate/once (ESM-only package) to fix jest/jsdom compatibility.
 * See: https://github.com/opensearch-project/alerting-dashboards-plugin/issues/236
 */

function once(emitter, event) {
  return new Promise((resolve, reject) => {
    const handler = (...args) => {
      emitter.removeListener(event, handler);
      emitter.removeListener('error', errorHandler);
      resolve(args);
    };
    const errorHandler = (err) => {
      emitter.removeListener(event, handler);
      emitter.removeListener('error', errorHandler);
      reject(err);
    };
    emitter.on(event, handler);
    emitter.on('error', errorHandler);
  });
}

module.exports = once;
module.exports.default = once;

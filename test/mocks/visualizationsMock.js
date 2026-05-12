/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const { Embeddable } = require('./embeddableMock');

class VisualizeEmbeddable extends Embeddable {
  constructor(input, parent) {
    super(input, parent);
  }
  getInput() {
    return { ...super.getInput(), id: 'mock-vis-id' };
  }
}

module.exports = {
  VisualizeEmbeddable,
};

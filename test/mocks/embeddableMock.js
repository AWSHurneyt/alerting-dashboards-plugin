/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const React = require('react');

class Embeddable {
  constructor(input, parent) {
    this.input = input || {};
    this.parent = parent;
  }
  getInput() {
    return this.input;
  }
  getOutput() {
    return {};
  }
  reload() {}
  destroy() {}
  render() {}
}

module.exports = {
  Embeddable,
  EmbeddableInput: {},
  IContainer: {},
  EmbeddableRenderer: ({ embeddable }) =>
    React.createElement('div', { 'data-test-subj': 'embeddableRenderer' }),
  ErrorEmbeddable: class ErrorEmbeddable extends Embeddable {},
  isErrorEmbeddable: () => false,
};

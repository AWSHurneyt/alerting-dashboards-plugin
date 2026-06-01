/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import Flyout from './Flyout';
import Flyouts from './flyouts';
jest.unmock('./flyouts');

describe('Flyout', () => {
  test('renders', () => {
    const { container } = render(
      <Flyout flyout={{ type: 'message', payload: null }} onClose={jest.fn()} />
    );
    expect(container).toMatchSnapshot();
  });

  test('renders null if no flyout', () => {
    const { container } = render(
      <Flyout flyout={{ type: 'definitely no flyout', payload: null }} onClose={jest.fn()} />
    );
    expect(container).toMatchSnapshot();
  });

  test('defaults if bad flyout data', () => {
    Flyouts.message = jest.fn(() => ({}));
    const { container } = render(
      <Flyout flyout={{ type: 'message', payload: null }} onClose={jest.fn()} />
    );
    expect(container).toMatchSnapshot();
  });
});

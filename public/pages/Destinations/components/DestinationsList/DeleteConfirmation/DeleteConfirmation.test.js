/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import DeleteConfirmation from './DeleteConfirmation';

describe('<DeleteConfirmation />', () => {
  test('should render if isVisible is provided to true', () => {
    const { baseElement } = render(
      <DeleteConfirmation isVisible onConfirm={jest.fn()} onCancel={jest.fn()} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  test('should render null if isVisible is provided to false', () => {
    const { container } = render(
      <DeleteConfirmation isVisible={false} onConfirm={jest.fn()} onCancel={jest.fn()} />
    );
    expect(container).toMatchSnapshot();
  });
});

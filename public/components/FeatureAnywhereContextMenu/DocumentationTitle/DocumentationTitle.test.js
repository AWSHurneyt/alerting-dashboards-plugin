/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import DocumentationTitle from './DocumentationTitle';

describe('DocumentationTitle', () => {
  test('renders', () => {
    const { container } = render(<DocumentationTitle />);
    expect(container).toMatchSnapshot();
  });

  test('title matches', () => {
    const { container } = render(<DocumentationTitle />);
    const title = container.querySelector('[data-ui="documentation-title-text"]');
    expect(title.textContent).toEqual('Documentation');
  });
});

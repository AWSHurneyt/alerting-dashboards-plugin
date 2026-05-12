/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import EnhancedAccordion from './EnhancedAccordion';

describe('EnhancedAccordion', () => {
  test('renders', () => {
    const { container } = render(<EnhancedAccordion />);
    expect(container).toMatchSnapshot();
  });
});

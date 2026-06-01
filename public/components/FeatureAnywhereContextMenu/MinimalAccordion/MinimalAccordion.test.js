/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import MinimalAccordion from './MinimalAccordion';

describe('MinimalAccordion', () => {
  test('renders', () => {
    const { container } = render(<MinimalAccordion />);
    expect(container).toMatchSnapshot();
  });
});

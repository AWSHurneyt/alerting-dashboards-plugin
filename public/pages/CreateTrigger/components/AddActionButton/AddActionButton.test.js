/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import AddActionButton from './AddActionButton';

describe('AddActionButton', () => {
  test('renders', () => {
    const { container } = render(<AddActionButton />);
    expect(container).toMatchSnapshot();
  });
});

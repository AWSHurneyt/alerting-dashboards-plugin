/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import AddTriggerButton from './AddTriggerButton';

describe('AddTriggerButton', () => {
  test('renders', () => {
    const { container } = render(<AddTriggerButton />);
    expect(container).toMatchSnapshot();
  });
});

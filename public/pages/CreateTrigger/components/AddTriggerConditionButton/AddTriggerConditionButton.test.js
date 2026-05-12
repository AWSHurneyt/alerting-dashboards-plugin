/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import AddTriggerConditionButton from './AddTriggerConditionButton';

describe('AddTriggerConditionButton', () => {
  test('renders', () => {
    const { container } = render(<AddTriggerConditionButton />);
    expect(container).toMatchSnapshot();
  });
});

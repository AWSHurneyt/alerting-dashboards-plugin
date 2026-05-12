/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import IconToolTip from './IconToolTip';

describe('IconToolTip', () => {
  test('renders', () => {
    const component = <IconToolTip iconType="questionInCircle" content="test content" />;
    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import EmptyHistory from './EmptyHistory';

describe('<EmptyHistory/>', () => {
  test('renders', () => {
    const { container } = render(<EmptyHistory onShowTrigger={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });
});

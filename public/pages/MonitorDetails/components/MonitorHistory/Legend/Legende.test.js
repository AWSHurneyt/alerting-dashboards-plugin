/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import Legend from './Legend';

describe('<Legend/>', () => {
  test('renders', () => {
    const { container } = render(<Legend />);
    expect(container).toMatchSnapshot();
  });
});

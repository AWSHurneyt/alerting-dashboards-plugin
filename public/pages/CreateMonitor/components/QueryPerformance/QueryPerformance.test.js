/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import QueryPerformance from './QueryPerformance';

describe('QueryPerformance', () => {
  test('renders', () => {
    const component = (
      <QueryPerformance response={{ took: 5, hits: { total: { value: 15, relation: 'eq' } } }} />
    );

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

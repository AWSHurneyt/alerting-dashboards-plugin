/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import DashboardControls from './DashboardControls';

describe('DashboardControls', () => {
  test('renders', () => {
    const component = (
      <DashboardControls
        activePage={1}
        pageCount={2}
        search={''}
        severity={'ALL'}
        state={'ALL'}
        onSearchChange={() => {}}
        onSeverityChange={() => {}}
        onStateChange={() => {}}
        onPageChange={() => {}}
      />
    );
    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

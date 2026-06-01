/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import OverviewStat from './OverviewStat';

describe('OverviewStat', () => {
  test('renders', () => {
    const component = <OverviewStat header="Test Header" value="Test Value" />;

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

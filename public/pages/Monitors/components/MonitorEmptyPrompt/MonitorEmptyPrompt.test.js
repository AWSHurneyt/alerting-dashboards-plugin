/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import MonitorEmptyPrompt from './MonitorEmptyPrompt';

describe('MonitorEmptyPrompt', () => {
  test('renders', () => {
    const component = <MonitorEmptyPrompt />;

    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import DashboardEmptyPrompt from './DashboardEmptyPrompt';
import { setupCoreStart } from '../../../../../test/utils/helpers';

beforeAll(() => {
  setupCoreStart();
});

describe('DashboardEmptyPrompt', () => {
  test('renders', () => {
    const component = <DashboardEmptyPrompt monitorDetails={false} onShowTrigger={() => {}} />;
    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

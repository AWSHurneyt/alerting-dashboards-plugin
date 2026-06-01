/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import SubHeader from './SubHeader';

describe('SubHeader', () => {
  test('renders', () => {
    const component = <SubHeader description={<div>description</div>} title={<div>title</div>} />;
    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
});

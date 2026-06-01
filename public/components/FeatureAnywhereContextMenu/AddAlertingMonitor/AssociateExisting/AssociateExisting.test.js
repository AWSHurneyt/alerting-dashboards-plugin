/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import AssociateExisting from './AssociateExisting';

describe('AssociateExisting', () => {
  test('renders', () => {
    const { container } = render(<AssociateExisting {...{ embeddable: { getTitle: () => '' } }} />);
    expect(container).toMatchSnapshot();
  });
});

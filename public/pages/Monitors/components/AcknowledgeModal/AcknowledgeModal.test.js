/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';

import AcknowledgeModal from './AcknowledgeModal';

describe('AcknowledgeModal', () => {
  test('renders', () => {
    const { container } = render(
      <AcknowledgeModal
        alerts={[]}
        totalAlerts={0}
        onClickCancel={jest.fn()}
        onAcknowledge={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });
});

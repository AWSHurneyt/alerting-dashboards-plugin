/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { EmptyFeaturesMessage } from './EmptyFeaturesMessage';
import { PREVIEW_ERROR_TYPE } from '../../../../../utils/constants';

describe('EmptyFeaturesMessage', () => {
  test('renders no feature', () => {
    const component = <EmptyFeaturesMessage detectorId="tempId" />;
    const { container } = render(component);
    expect(container).toMatchSnapshot();
  });
  test('renders no enabled feature', () => {
    const component = (
      <EmptyFeaturesMessage
        detectorId="tempId"
        previewErrorType={PREVIEW_ERROR_TYPE.NO_ENABLED_FEATURES}
      />
    );
    const { container } = render(component);
    expect(container.querySelector('[data-test-subj~="editButton"]').textContent).toEqual(
      'Enable Feature'
    );
  });
});

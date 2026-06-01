/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DestinationsControls from './DestinationsControls';
import { DESTINATION_TYPE } from '../../../utils/constants';

describe('<DestinationsControls />', () => {
  const mockedProps = {
    activePage: 0,
    pageCount: 10,
    onSearchChange: jest.fn(),
    onTypeChange: jest.fn(),
    onPageClick: jest.fn(),
    allowList: Object.values(DESTINATION_TYPE),
  };
  beforeEach(() => jest.resetAllMocks());

  test('should render DestinationsControls', () => {
    const { container } = render(<DestinationsControls {...mockedProps} />);
    expect(container).toMatchSnapshot();
  });

  test('should invoke handlers with expected values', () => {
    const { container } = render(<DestinationsControls {...mockedProps} />);

    // Validate search field changes
    const searchInput = container.querySelector('input');
    fireEvent.change(searchInput, { target: { value: 'search destination' } });
    expect(mockedProps.onSearchChange).toHaveBeenCalledTimes(1);

    // Validate destination type change
    const select = container.querySelector('select');
    fireEvent.change(select, { target: { value: 'chime' } });
    expect(mockedProps.onTypeChange).toHaveBeenCalledTimes(1);

    // Validate page navigation
    const page4Button = container.querySelector('[data-test-subj="pagination-button-3"]');
    fireEvent.click(page4Button);
    expect(mockedProps.onPageClick).toHaveBeenCalledTimes(1);
    expect(mockedProps.onPageClick).toHaveBeenCalledWith(3);
  });
});

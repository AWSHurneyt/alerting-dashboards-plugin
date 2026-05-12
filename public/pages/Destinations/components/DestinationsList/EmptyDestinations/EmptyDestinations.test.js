/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmptyDestinations from './EmptyDestinations';

describe('<EmptyDestinations />', () => {
  test('should render empty destinations message', () => {
    const { container } = render(
      <EmptyDestinations isFilterApplied={false} onResetFilters={jest.fn()} />
    );
    expect(container).toMatchSnapshot();
  });

  test('should render no results for filter criteria', () => {
    const { container } = render(<EmptyDestinations isFilterApplied onResetFilters={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });

  test('should call reset Filters callback on click of Reset Filters Button', () => {
    const handleResetFilter = jest.fn();
    render(<EmptyDestinations isFilterApplied onResetFilters={handleResetFilter} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleResetFilter).toHaveBeenCalledTimes(1);
  });
});

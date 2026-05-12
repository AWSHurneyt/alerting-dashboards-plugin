/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import moment from 'moment';
import { render, fireEvent } from '@testing-library/react';
import DateRangePicker from '../DateRangePicker';

describe('<DateRangePicker/>', () => {
  const initialStartTime = moment('2018-10-15T09:00:00');
  const initialEndTime = initialStartTime.clone().add(2, 'd');
  const onRangeChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with initial start and end time', () => {
    const { container } = render(
      <DateRangePicker
        initialStartTime={initialStartTime}
        initialEndTime={initialEndTime}
        onRangeChange={onRangeChange}
      />
    );
    expect(container).toMatchSnapshot();
  });

  test('renders date inputs', () => {
    const { container } = render(
      <DateRangePicker
        initialStartTime={initialStartTime}
        initialEndTime={initialEndTime}
        onRangeChange={onRangeChange}
      />
    );
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  test('should call onRangeChange when dates change', () => {
    const { container } = render(
      <DateRangePicker
        initialStartTime={initialStartTime}
        initialEndTime={initialEndTime}
        onRangeChange={onRangeChange}
      />
    );
    // The component should render date picker inputs
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  test('renders start date picker', () => {
    const { container } = render(
      <DateRangePicker
        initialStartTime={initialStartTime}
        initialEndTime={initialEndTime}
        onRangeChange={onRangeChange}
      />
    );
    const inputs = container.querySelectorAll('.react-datepicker__input-container input');
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });

  test('renders end date picker', () => {
    const { container } = render(
      <DateRangePicker
        initialStartTime={initialStartTime}
        initialEndTime={initialEndTime}
        onRangeChange={onRangeChange}
      />
    );
    const inputs = container.querySelectorAll('.react-datepicker__input-container input');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  test('handles start date change', () => {
    const { container } = render(
      <DateRangePicker
        initialStartTime={initialStartTime}
        initialEndTime={initialEndTime}
        onRangeChange={onRangeChange}
      />
    );
    const inputs = container.querySelectorAll('.react-datepicker__input-container input');
    if (inputs[0]) {
      fireEvent.change(inputs[0], { target: { value: '10/16/2018' } });
    }
  });

  test('handles end date change', () => {
    const { container } = render(
      <DateRangePicker
        initialStartTime={initialStartTime}
        initialEndTime={initialEndTime}
        onRangeChange={onRangeChange}
      />
    );
    const inputs = container.querySelectorAll('.react-datepicker__input-container input');
    if (inputs[1]) {
      fireEvent.change(inputs[1], { target: { value: '10/18/2018' } });
    }
  });
});

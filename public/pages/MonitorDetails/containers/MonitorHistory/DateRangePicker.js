/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { EuiFlexGroup, EuiFlexItem, EuiDatePickerRange, EuiDatePicker } from '@elastic/eui';
import { MAX_DAYS_ALLOWED_IN_RANGE } from './utils/constants';
import { isToday, getRangeMaxTime } from './utils/timeUtils';

const getStartDatePickerProps = (startDateTime) => ({
  selected: startDateTime.isAfter(moment()) ? moment().startOf('day') : startDateTime,
  minTime: startDateTime.clone().startOf('day'),
  maxTime: getRangeMaxTime(startDateTime),
  maxDate: moment(),
});

const getEndDatePickerProps = (startDateTime, endDateTime) => {
  const maxDate = startDateTime.clone().add(MAX_DAYS_ALLOWED_IN_RANGE, 'days');
  const now = moment();
  return {
    selected: endDateTime,
    minTime: endDateTime.clone().startOf('day'),
    maxTime: getRangeMaxTime(endDateTime),
    maxDate: maxDate > now ? now : maxDate,
    injectTimes: isToday(endDateTime) ? [now] : [],
  };
};

const DateRangePicker = ({ initialStartTime, initialEndTime, onRangeChange, compressed }) => {
  const [rangeStartDateTime, setRangeStartDateTime] = useState(
    getStartDatePickerProps(initialStartTime)
  );
  const [rangeEndDateTime, setRangeEndDateTime] = useState(
    getEndDatePickerProps(initialStartTime, initialEndTime)
  );

  const handleChangeStart = useCallback(
    (startDateTime) => {
      let endTime = rangeEndDateTime.selected;
      if (endTime.isSame(startDateTime)) {
        endTime = startDateTime.clone().add(30, 'm');
      } else if (
        endTime.isBefore(startDateTime) ||
        endTime.diff(startDateTime, 'days') > MAX_DAYS_ALLOWED_IN_RANGE
      ) {
        endTime = startDateTime.clone().add(1, 'd');
      }
      onRangeChange(startDateTime, endTime);
      setRangeStartDateTime(getStartDatePickerProps(startDateTime));
      setRangeEndDateTime(getEndDatePickerProps(startDateTime, endTime));
    },
    [rangeEndDateTime.selected, onRangeChange]
  );

  const handleChangeEnd = useCallback(
    (endDateTime) => {
      let startTime = rangeStartDateTime.selected;
      if (startTime.isSame(endDateTime)) {
        startTime = endDateTime.clone().subtract(30, 'm');
      } else if (startTime.isAfter(endDateTime)) {
        startTime = endDateTime.clone().subtract(30, 'm');
      }
      onRangeChange(startTime, endDateTime);
      setRangeStartDateTime((prev) => ({ ...prev, selected: startTime }));
      setRangeEndDateTime((prev) => ({ ...prev, selected: endDateTime }));
    },
    [rangeStartDateTime.selected, onRangeChange]
  );

  return (
    <EuiFlexGroup alignItems="center" justifyContent="flexEnd">
      <EuiFlexItem grow={false} style={{ padding: '0 10px' }}>
        <EuiDatePickerRange
          fullWidth
          startDateControl={
            <EuiDatePicker
              selected={rangeStartDateTime.selected}
              onChange={handleChangeStart}
              startDate={rangeStartDateTime.selected}
              endDate={rangeEndDateTime.selected}
              isInvalid={rangeStartDateTime.selected > rangeEndDateTime.selected}
              aria-label="Start date"
              showTimeSelect
              popperClassName="euiRangePicker--popper"
              shouldCloseOnSelect
              className={compressed ? 'euiFieldText--compressed' : ''}
              {...rangeStartDateTime}
            />
          }
          endDateControl={
            <EuiDatePicker
              selected={rangeEndDateTime.selected}
              onChange={handleChangeEnd}
              startDate={rangeStartDateTime.selected}
              endDate={rangeEndDateTime.selected}
              isInvalid={rangeStartDateTime.selected > rangeEndDateTime.selected}
              aria-label="End date"
              showTimeSelect
              popperClassName="euiRangePicker--popper"
              shouldCloseOnSelect
              className={compressed ? 'euiFieldText--compressed' : ''}
              {...rangeEndDateTime}
            />
          }
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

DateRangePicker.propTypes = {
  onRangeChange: PropTypes.func.isRequired,
};

export default DateRangePicker;

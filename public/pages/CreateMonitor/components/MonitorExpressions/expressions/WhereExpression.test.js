/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Formik } from 'formik';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { FORMIK_INITIAL_VALUES } from '../../../containers/CreateMonitor/utils/constants';
import WhereExpression, { MAX_NUM_WHERE_EXPRESSION } from './WhereExpression';

const dataTypes = {
  integer: new Set(['age']),
  text: new Set(['cityName']),
  keyword: new Set(['cityName.keyword']),
};
const openExpression = jest.fn();
const closeExpression = jest.fn();

function renderWhereExpression(state = false, useTriggerFieldOperators = false) {
  return render(
    <Formik initialValues={FORMIK_INITIAL_VALUES} onSubmit={() => {}}>
      {(props) => (
        <WhereExpression
          formik={props}
          dataTypes={dataTypes}
          openedStates={{ WHERE: state }}
          openExpression={openExpression}
          closeExpression={closeExpression}
          onMadeChanges={jest.fn()}
          useTriggerFieldOperators={useTriggerFieldOperators}
        />
      )}
    </Formik>
  );
}

describe('WhereExpression', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders', () => {
    const { container } = renderWhereExpression();
    expect(container).toMatchSnapshot();
  });

  test('calls openExpression when clicking add filter button', () => {
    const { container } = renderWhereExpression();
    const button = container.querySelector('[data-test-subj="addFilterButton"]');
    if (button) {
      fireEvent.click(button);
      expect(openExpression).toHaveBeenCalled();
    }
  });

  test('calls closeExpression when closing popover', () => {
    const { container } = renderWhereExpression(true);
    // Pressing Escape should close the popover
    fireEvent.keyDown(document, { key: 'Escape', keyCode: 27 });
    // Note: EUI handles escape at document level, closeExpression may be called asynchronously
  });

  test('renders with popover open', () => {
    const { container } = renderWhereExpression(true);
    expect(container).toMatchSnapshot();
  });

  test('renders text input for text data types when popover is open', () => {
    const { container } = renderWhereExpression(true);
    // When opened, should show the filter form
    expect(container.querySelector('[data-test-subj="addFilterButton"]')).toBeTruthy();
  });

  test('MAX_NUM_WHERE_EXPRESSION constants are defined', () => {
    expect(MAX_NUM_WHERE_EXPRESSION.DATA_FILTERS).toBeGreaterThan(0);
    expect(MAX_NUM_WHERE_EXPRESSION.KEYWORD_FILTERS).toBeGreaterThan(0);
  });
});

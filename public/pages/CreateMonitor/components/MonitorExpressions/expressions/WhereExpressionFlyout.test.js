/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';

jest.mock('./utils/constants', () => ({
  Expressions: { WHERE: 'where' },
  POPOVER_STYLE: {},
  EXPRESSION_STYLE: {},
  WHERE_BOOLEAN_FILTERS: [{ text: 'AND' }, { text: 'OR' }],
  MAX_NUM_WHERE_EXPRESSION: 5,
}));
jest.mock('./utils/whereHelpers', () => ({
  getOperators: jest.fn(() => []),
  displayText: jest.fn(() => ''),
  validateRange: jest.fn(),
  isNullOperator: jest.fn(() => false),
  isRangeOperator: jest.fn(() => false),
  getIsDataFilterActive: jest.fn(() => false),
}));
jest.mock('../../../../../utils/validate', () => ({
  hasError: jest.fn(() => false),
  isInvalid: jest.fn(() => false),
  isInvalidWithoutTouch: jest.fn(() => false),
  required: jest.fn(),
  requiredValidation: jest.fn(),
}));
jest.mock('../../../../../components/FormControls', () => ({
  FormikComboBox: () => null,
  FormikSelect: () => null,
  FormikFieldNumber: () => null,
  FormikFieldText: () => null,
}));
jest.mock('./utils/dataTypes', () => ({
  getFilteredIndexFields: jest.fn(() => []),
  getIndexFields: jest.fn(() => []),
}));
jest.mock('../../../containers/CreateMonitor/utils/constants', () => ({
  FILTERS_TOOLTIP_TEXT: 'tooltip',
  FORMIK_INITIAL_VALUES: {},
}));
jest.mock('../../../../../utils/constants', () => ({
  DATA_TYPES: { NUMBER: 'number', TEXT: 'text', KEYWORD: 'keyword' },
}));
jest.mock(
  '../../../../CreateTrigger/containers/DefineBucketLevelTrigger/DefineBucketLevelTrigger',
  () => ({
    TRIGGER_COMPARISON_OPERATORS: [],
    TRIGGER_OPERATORS_MAP: {},
  })
);
jest.mock('../../../../CreateTrigger/containers/CreateTrigger/utils/constants', () => ({
  FORMIK_INITIAL_TRIGGER_VALUES: {},
}));
jest.mock('../../../../../utils/helpers', () => ({
  inputLimitText: jest.fn(() => ''),
}));
jest.mock('../../../../../components/IconToolTip', () => () => null);

import WhereExpressionFlyout from './WhereExpressionFlyout';

// WhereExpressionFlyout uses formik's connect() HOC
const WrappedComponent = WhereExpressionFlyout.WrappedComponent || WhereExpressionFlyout;

describe('WhereExpressionFlyout', () => {
  const defaultProps = {
    formik: { values: { where: { fieldName: [], operator: 'is' } } },
    dataTypes: { number: [], text: [], keyword: [] },
    indexFieldFilters: [],
    openedStates: {},
    openExpression: jest.fn(),
    closeExpression: jest.fn(),
    onMadeChanges: jest.fn(),
    fieldPath: '',
    useTriggerFieldOperators: false,
  };

  test('renders', () => {
    const { container } = render(
      <Formik initialValues={{ where: { fieldName: [], operator: 'is' } }} onSubmit={() => {}}>
        <WrappedComponent {...defaultProps} />
      </Formik>
    );
    expect(container).toBeTruthy();
  });
});

/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { connect } from 'formik';
import _ from 'lodash';
import { EuiPopover, EuiExpression } from '@elastic/eui';

import { FormikComboBox } from '../../../../../components/FormControls';
import { POPOVER_STYLE, EXPRESSION_STYLE, Expressions } from './utils/constants';
import { getOfExpressionAllowedTypes } from './utils/helpers';
import { getIndexFields } from './utils/dataTypes';

const OfExpression = ({
  formik: { values },
  openedStates,
  closeExpression,
  openExpression,
  onMadeChanges,
  dataTypes,
}) => {
  const onChangeWrapper = (options, field, form) => {
    onMadeChanges();
    form.setFieldValue('fieldName', options);
  };

  const options = getIndexFields(dataTypes, getOfExpressionAllowedTypes(values));
  const expressionWidth =
    Math.max(
      ...options.map(({ options }) =>
        options.reduce((accu, curr) => Math.max(accu, curr.label.length), 0)
      )
    ) *
      8 +
    60;
  const fieldName = _.get(values, 'fieldName[0].label', 'Select a field');

  return (
    <EuiPopover
      id="of-popover"
      button={
        <EuiExpression
          description="of"
          value={fieldName}
          isActive={openedStates.OF_FIELD}
          onClick={() => openExpression(Expressions.OF_FIELD)}
        />
      }
      isOpen={openedStates.OF_FIELD}
      closePopover={() => closeExpression(Expressions.OF_FIELD)}
      panelPaddingSize="none"
      ownFocus
      withTitle
      anchorPosition="downLeft"
    >
      <div style={{ width: Math.max(expressionWidth, 180), ...POPOVER_STYLE, ...EXPRESSION_STYLE }}>
        <FormikComboBox
          name="fieldName"
          inputProps={{
            placeholder: 'Select a field',
            options,
            onChange: onChangeWrapper,
            isClearable: false,
            singleSelection: { asPlainText: true },
            'data-test-subj': 'ofFieldComboBox',
          }}
        />
      </div>
    </EuiPopover>
  );
};

export default connect(OfExpression);

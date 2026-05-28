/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { connect } from 'formik';
import { EuiPopover, EuiExpression } from '@elastic/eui';

import { POPOVER_STYLE, Expressions, OVER_TYPES, EXPRESSION_STYLE } from './utils/constants';
import { FormikSelect } from '../../../../../components/FormControls';

const OverExpression = ({
  formik: { values },
  openedStates,
  closeExpression,
  openExpression,
  onMadeChanges,
}) => {
  const onChangeWrapper = (e, field) => {
    onMadeChanges();
    field.onChange(e);
  };

  const isGroupedOver = values.overDocuments === 'top';
  const buttonValue = isGroupedOver
    ? `${values.overDocuments} ${values.groupedOverTop} ${values.groupedOverFieldName}`
    : values.overDocuments;

  return (
    <EuiPopover
      id="over-popover"
      button={
        <EuiExpression
          description={isGroupedOver ? 'grouped over' : 'over'}
          value={buttonValue}
          isActive={openedStates.OVER}
          onClick={() => openExpression(Expressions.OVER)}
        />
      }
      isOpen={openedStates.OVER}
      closePopover={() => closeExpression(Expressions.OVER)}
      panelPaddingSize="none"
      ownFocus
      withTitle
      anchorPosition="downLeft"
    >
      <div style={{ ...POPOVER_STYLE, ...EXPRESSION_STYLE }}>
        <FormikSelect
          name="overDocuments"
          inputProps={{ onChange: onChangeWrapper, options: OVER_TYPES }}
        />
      </div>
    </EuiPopover>
  );
};

export default connect(OverExpression);

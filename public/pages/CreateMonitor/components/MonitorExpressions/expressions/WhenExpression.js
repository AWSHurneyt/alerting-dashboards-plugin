/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { connect } from 'formik';
import { EuiPopover, EuiExpression } from '@elastic/eui';

import { Expressions, POPOVER_STYLE, AGGREGATION_TYPES, EXPRESSION_STYLE } from './utils/constants';
import { selectOptionValueToText } from './utils/helpers';
import { FormikSelect } from '../../../../../components/FormControls';

const WhenExpression = ({
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

  return (
    <EuiPopover
      id="when-popover"
      button={
        <EuiExpression
          description="when"
          value={selectOptionValueToText(values.aggregationType, AGGREGATION_TYPES)}
          isActive={openedStates.WHEN}
          onClick={() => openExpression(Expressions.WHEN)}
        />
      }
      isOpen={openedStates.WHEN}
      closePopover={() => closeExpression(Expressions.WHEN)}
      panelPaddingSize="none"
      ownFocus
      withTitle
      anchorPosition="downLeft"
    >
      <div style={{ width: 180, ...POPOVER_STYLE, ...EXPRESSION_STYLE }}>
        <FormikSelect
          name="aggregationType"
          inputProps={{
            onChange: onChangeWrapper,
            options: AGGREGATION_TYPES,
          }}
        />
      </div>
    </EuiPopover>
  );
};

export default connect(WhenExpression);

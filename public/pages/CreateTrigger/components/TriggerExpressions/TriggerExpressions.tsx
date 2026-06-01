/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Field } from 'formik';
import {
  EuiCompressedFieldNumber,
  EuiFlexGroup,
  EuiFlexItem,
  EuiCompressedFormRow,
  EuiCompressedSelect,
} from '@elastic/eui';
import { THRESHOLD_ENUM_OPTIONS } from '../../utils/constants';

export const Expressions = { THRESHOLD: 'THRESHOLD' };

interface TriggerExpressionsProps {
  label: string;
  keyFieldName: string;
  valueFieldName: string;
  flyoutMode?: string;
}

const TriggerExpressions: React.FC<TriggerExpressionsProps> = ({ label, keyFieldName, valueFieldName, flyoutMode }) => (
  <EuiCompressedFormRow
    label={label}
    style={flyoutMode ? { maxWidth: '100%' } : { width: '390px' }}
  >
    <EuiFlexGroup alignItems={'flexStart'} gutterSize={'m'}>
      <EuiFlexItem grow={1}>
        <Field name={keyFieldName}>
          {({ field: { onBlur, ...rest }, form: { touched, errors } }) => (
            <EuiCompressedFormRow
              isInvalid={touched.thresholdEnum && !!errors.thresholdEnum}
              error={errors.thresholdEnum}
            >
              <EuiCompressedSelect
                options={THRESHOLD_ENUM_OPTIONS}
                data-test-subj={`${keyFieldName}_conditionEnumField`}
                {...rest}
              />
            </EuiCompressedFormRow>
          )}
        </Field>
      </EuiFlexItem>

      <EuiFlexItem grow={1}>
        <Field name={valueFieldName}>
          {({ field, form: { touched, errors } }) => (
            <EuiCompressedFormRow
              isInvalid={touched.thresholdValue && !!errors.thresholdValue}
              error={errors.thresholdValue}
            >
              <EuiCompressedFieldNumber
                data-test-subj={`${valueFieldName}_conditionValueField`}
                {...field}
              />
            </EuiCompressedFormRow>
          )}
        </Field>
      </EuiFlexItem>
    </EuiFlexGroup>
  </EuiCompressedFormRow>
);

export default TriggerExpressions;

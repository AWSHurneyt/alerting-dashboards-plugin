/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 *   Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License").
 *   You may not use this file except in compliance with the License.
 *   A copy of the License is located at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   or in the "license" file accompanying this file. This file is distributed
 *   on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *   express or implied. See the License for the specific language governing
 *   permissions and limitations under the License.
 */

import React, { Fragment } from 'react';
import _ from 'lodash';
import { EuiButton, EuiSpacer, EuiCodeEditor, EuiFormRow, EuiText } from '@elastic/eui';
import {
  hasError,
  isInvalid,
  isInvalidApiPath,
  required,
  validateRequiredApiPath,
} from '../../../../utils/validate';
import { FormikComboBox, FormikFieldText } from '../../../../components/FormControls';
import IconToolTip from '../../../../components/IconToolTip';
import { METRIC_TOOLTIP_TEXT } from '../../containers/CreateMonitor/utils/constants';

export const SUPPORTED_API_ENUM = {
  CLUSTER_HEALTH: 'CLUSTER_HEALTH',
  CLUSTER_STATS: 'CLUSTER_STATS',
};

export const SUPPORTED_API_PATHS = (hasPathParams = false) => {
  const paths = {};
  paths[SUPPORTED_API_ENUM.CLUSTER_HEALTH] = '_cluster/health';
  paths[SUPPORTED_API_ENUM.CLUSTER_STATS] = hasPathParams
    ? '_cluster/stats/nodes/'
    : '_cluster/stats';
  return paths;
};

// TODO hurneyt: create regex expressions for validating
export const SUPPORTED_API_REGEX = () => {
  const regexes = {};
  regexes[SUPPORTED_API_ENUM.CLUSTER_HEALTH] = 'HURNEYTregex';
  return regexes;
};

const SUPPORTED_API_LABELS = [
  { value: SUPPORTED_API_ENUM.CLUSTER_HEALTH, label: ' Cluster health (GET _cluster/health)' },
  {
    value: SUPPORTED_API_ENUM.CLUSTER_STATS,
    label: 'Cluster stats (GET _cluster/stats or _cluster/stats/nodes/<node_filter>)',
  },
];

const LocalUriInput = ({ isDarkMode, onRunQuery, response, values }) => {
  const pathIsEmpty = _.isEmpty(_.get(values, 'uri.path'));
  return (
    <Fragment>
      <EuiSpacer size={'m'} />

      <FormikComboBox
        // TODO hurneyt basing this implementation on line 334 of Message.js
        name={'uri.path'}
        formRow
        rowProps={{
          label: (
            <div>
              <EuiText size={'xs'}>
                <strong>API request type</strong>
              </EuiText>
              <EuiText color={'subdued'} size={'xs'}>
                Specify a request type to monitor cluster metrics such as health, JVM, and CPU
                usage.
              </EuiText>
            </div>
          ),
          isInvalid: isInvalidApiPath,
          error: 'Select an API.',
        }}
        inputProps={{
          placeholder: 'Select an API',
          options: SUPPORTED_API_LABELS,
          onBlur: (e, field, form) => {
            form.setFieldTouched('uri.path');
          },
          onChange: (options, field, form) => {
            form.setFieldValue('uri.path', options);
          },
          isClearable: true,
          singleSelection: { asPlainText: true },
        }}
      />
      {/*// TODO: Perhaps add help text with a hyperlink to the Elasticsearch documentation for the selected API*/}

      <EuiSpacer size={'l'} />

      <FormikComboBox
        name={'uri.pathParams'}
        formRow={true}
        // fieldProps={// TODO hurneyt: validate to include only letters and numbers?}
        rowProps={{
          label: (
            <div>
              <EuiText size="xs">
                <strong>Path parameters</strong>
                <i> - optional </i>
              </EuiText>
              <EuiText color={'subdued'} size={'xs'}>
                Filter responses from specific resources such as data streams and indices.
              </EuiText>
            </div>
          ),
        }}
        inputProps={{
          placeholder: 'Enter path parameters',
          options: _.get(values, 'uri.pathParams', []),
          onChange: (options, field, form) => {
            form.setFieldValue('uri.pathParams', options);
          },
          onBlur: (e, field, form) => {
            form.setFieldTouched('uri.pathParams', true);
          },
          onCreateOption: (value, field, form) => {
            const newPathParameter = { label: value.trim() };
            if (_.isEmpty(newPathParameter)) return false;
            form.setFieldValue('uri.pathParams', [...field.value, newPathParameter]);
          },
          isClearable: true,
          selectedOptions: _.get(values, 'uri.pathParams', []),
          isDisabled: pathIsEmpty,
          delimiter: ' ',
        }}
      />

      <EuiSpacer size={'l'} />

      <EuiButton disabled={pathIsEmpty} fill={false} onClick={onRunQuery} size={'s'}>
        Run for response
      </EuiButton>

      <EuiSpacer size={'l'} />

      <EuiFormRow label={'Response'}>
        <EuiCodeEditor
          mode={'json'}
          theme={isDarkMode ? 'sense-dark' : 'github'}
          width={'400px'}
          height={'500px'}
          value={pathIsEmpty ? undefined : response}
          readOnly
        />
      </EuiFormRow>
    </Fragment>
  );
};

export default LocalUriInput;

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
import {
  EuiSpacer,
  EuiFlexItem,
  EuiFlexGroup,
  EuiCodeEditor,
  EuiFormRow,
  EuiText,
} from '@elastic/eui';
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

const SUPPORTED_API_ENUM = {
  CLUSTER_HEALTH: 'CLUSTER_HEALTH',
  CLUSTER_STATS: 'CLUSTER_STATS',
};

const SUPPORTED_API_PATHS = (hasPathParameters = false) => {
  const paths = {};
  paths[SUPPORTED_API_ENUM.CLUSTER_HEALTH] = hasPathParameters
    ? '_cluster/health/'
    : '_cluster/health';
  paths[SUPPORTED_API_ENUM.CLUSTER_STATS] = hasPathParameters
    ? '_cluster/stats'
    : '_cluster/stats/nodes/';
  return paths;
};

// TODO hurneyt: create regex expressions for validating
const SUPPORTED_API_REGEX = () => {
  const regexes = {};
  regexes[SUPPORTED_API_ENUM.CLUSTER_HEALTH] = 'fvfv';
  return regexes;
};

const SUPPORTED_API_LABELS = [
  { value: SUPPORTED_API_ENUM.CLUSTER_HEALTH, label: ' Cluster health (GET _cluster/health)' },
  {
    value: SUPPORTED_API_ENUM.CLUSTER_STATS,
    label: 'Cluster stats (GET _cluster/stats or _cluster/stats/nodes/<node_filter>)',
  },
];

const LocalUriInput = ({ isDarkMode, response, values }) => {
  return (
    <Fragment>
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

      <FormikComboBox
        name={'uri.pathParameters'}
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
          options: _.get(values, 'uri.pathParameters', []),
          onChange: (options, field, form) => {
            form.setFieldValue('uri.pathParameters', options);
          },
          onBlur: (e, field, form) => {
            form.setFieldTouched('uri.pathParameters', true);
          },
          onCreateOption: (value, field, form) => {
            // try {
            //   console.info(`hurneyt value JSON = ${JSON.stringify(value)}`)
            // } catch (err) {
            //   console.info(`hurneyt value KEYS = ${_.keys(value)}`)
            // }
            // try {
            //   console.info(`hurneyt field JSON = ${JSON.stringify(field)}`)
            // } catch (err) {
            //   console.info(`hurneyt field KEYS = ${_.keys(field)}`)
            // }
            // try {
            //   console.info(`hurneyt form JSON = ${JSON.stringify(form)}`)
            // } catch (err) {
            //   console.info(`hurneyt form KEYS = ${_.keys(form)}`)
            // }
            const newPathParameter = { label: value.trim() };
            if (_.isEmpty(newPathParameter)) return false;
            form.setFieldValue('uri.pathParameters', [...field.value, newPathParameter]);
          },
          isClearable: true,
          selectedOptions: _.get(values, 'uri.pathParameters', []),
          isDisabled: _.isEmpty(_.get(values, 'uri.path')),
          delimiter: ' ',
        }}
      />

      {/*<EuiFlexGroup alignItems="flexStart">*/}
      {/*  <EuiFlexItem>*/}
      {/*    <EuiSpacer size="m" />*/}
      {/*    <FormikFieldText*/}
      {/*      name={`${values.searchType}.path`}*/}
      {/*      formRow*/}
      {/*      rowProps={{*/}
      {/*        label: 'Path',*/}
      {/*        helpText:*/}
      {/*          'The path associated with the REST API the monitor should call (e.g., "/_cluster/health").',*/}
      {/*        style: { paddingLeft: '10px' },*/}
      {/*        isInvalid,*/}
      {/*        error: 'Select an API.',*/}
      {/*      }}*/}
      {/*      inputProps={{*/}
      {/*        isInvalid,*/}
      {/*        onChange: (e, field, form) => {*/}
      {/*          form.setFieldValue('uri.path', e.target.value);*/}
      {/*        },*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </EuiFlexItem>*/}
      {/*  <EuiFlexItem>*/}
      {/*    <EuiFormRow label="Response" fullWidth>*/}
      {/*      <EuiCodeEditor*/}
      {/*        mode="json"*/}
      {/*        theme={isDarkMode ? 'sense-dark' : 'github'}*/}
      {/*        width="100%"*/}
      {/*        height="500px"*/}
      {/*        value={response}*/}
      {/*        readOnly*/}
      {/*      />*/}
      {/*    </EuiFormRow>*/}
      {/*  </EuiFlexItem>*/}
      {/*</EuiFlexGroup>*/}
    </Fragment>
  );
};

export default LocalUriInput;

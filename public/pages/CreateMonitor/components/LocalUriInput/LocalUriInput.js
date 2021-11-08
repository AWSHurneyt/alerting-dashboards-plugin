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

import React from 'react';
import _ from 'lodash';
import { EuiButton, EuiCodeEditor, EuiFormRow, EuiLink, EuiSpacer, EuiText } from '@elastic/eui';
import { isInvalidApiPath } from '../../../../utils/validate';
import { FormikComboBox, FormikFieldText } from '../../../../components/FormControls';
import {
  API_PATH_REQUIRED_PLACEHOLDER_TEXT,
  EMPTY_PATH_PARAMS_TEXT,
  REST_API_REFERENCE,
  API_TYPES_APPEND_TEXT,
  API_TYPES_DOCUMENTATION,
  API_TYPES,
  API_TYPES_LABELS,
  API_TYPES_PATHS,
  API_TYPES_PREPEND_TEXT,
} from './utils/localUriConstants';
import {
  getApiPath,
  getExamplePathParams,
  isInvalidApiPathParameter,
  validateApiPathParameter,
} from './utils/localUriHelpers';
import { FORMIK_INITIAL_VALUES } from '../../containers/CreateMonitor/utils/constants';

const LocalUriInput = ({
  isDarkMode,
  loadingResponse = false,
  loadingSupportedApiList = false,
  onRunQuery,
  resetResponse,
  response,
  supportedApiList = [],
  values,
}) => {
  const apiType = _.get(values, 'uri.api_type');
  const path = _.get(values, 'uri.path');
  const pathIsEmpty = _.isEmpty(path);
  const pathParams = _.get(values, 'uri.path_params', FORMIK_INITIAL_VALUES.uri.path_params);
  const supportsPathParams = !_.isEmpty(_.get(API_TYPES_PATHS, `${apiType}.withPathParams`));
  const requirePathParams = _.isEmpty(_.get(API_TYPES_PATHS, `${apiType}.withoutPathParams`));
  const hidePathParams = pathIsEmpty || loadingSupportedApiList || !supportsPathParams;
  const disableRunButton = pathIsEmpty || (_.isEmpty(pathParams) && requirePathParams);
  return (
    <div>
      <EuiSpacer size={'m'} />

      <FormikComboBox
        name={'uri.api_type'}
        formRow
        rowProps={{
          label: (
            <div>
              <EuiText size={'xs'}>
                <strong>API request type</strong>
              </EuiText>
              <EuiText color={'subdued'} size={'xs'}>
                Specify a request type to monitor cluster metrics such as health, JVM, and CPU
                usage.{' '}
                <EuiLink external href={REST_API_REFERENCE}>
                  Learn more
                </EuiLink>
              </EuiText>
            </div>
          ),
          isInvalid: isInvalidApiPath,
          error: API_PATH_REQUIRED_PLACEHOLDER_TEXT,
        }}
        inputProps={{
          placeholder: loadingSupportedApiList ? 'Loading API options' : 'Select an API',
          options: supportedApiList,
          onBlur: (e, field, form) => {
            form.setFieldTouched('uri.api_type');
          },
          onChange: (options, field, form) => {
            const selectedApiType = _.get(options, '0.value');
            if (selectedApiType !== apiType) {
              const doesNotUsePathParams = _.isEmpty(
                _.get(API_TYPES_PATHS, `${selectedApiType}.withPathParams`)
              );
              if (doesNotUsePathParams)
                form.setFieldValue('uri.path_params', FORMIK_INITIAL_VALUES.uri.path_params);
              resetResponse();
              form.setFieldTouched('uri.path_params', false);
            }
            form.setFieldValue('uri.api_type', selectedApiType);
            form.setFieldValue('uri.path', getApiPath(_.isEmpty(pathParams), selectedApiType));
          },
          isClearable: true,
          singleSelection: { asPlainText: true },
          selectedOptions: !_.isEmpty(apiType)
            ? [{ value: API_TYPES[apiType], label: API_TYPES_LABELS[apiType] }]
            : undefined,
          isDisabled: loadingSupportedApiList,
          isLoading: loadingSupportedApiList,
        }}
      />

      <EuiSpacer size={'l'} />

      {!hidePathParams ? (
        <div>
          <FormikFieldText
            name={'uri.path_params'}
            formRow
            fieldProps={{
              validate: validateApiPathParameter(pathParams, requirePathParams, hidePathParams),
            }}
            rowProps={{
              label: (
                <div>
                  <EuiText size={'xs'}>
                    <strong>Path parameters</strong>
                    {!requirePathParams && <i> - optional </i>}
                  </EuiText>
                  <EuiText color={'subdued'} size={'xs'}>
                    Filter responses by providing path parameters for the{' '}
                    {API_TYPES_LABELS[apiType] || 'selected'} API.{' '}
                    {!pathIsEmpty && !_.isEmpty(API_TYPES_DOCUMENTATION[apiType]) && (
                      <EuiLink external href={API_TYPES_DOCUMENTATION[apiType]} target={'_blank'}>
                        Learn more
                      </EuiLink>
                    )}
                  </EuiText>
                </div>
              ),
              style: { maxWidth: '600px' },
              isInvalid: isInvalidApiPathParameter(pathParams, requirePathParams, hidePathParams),
              error: validateApiPathParameter(pathParams, requirePathParams, hidePathParams),
            }}
            inputProps={{
              placeholder: pathIsEmpty ? EMPTY_PATH_PARAMS_TEXT : getExamplePathParams(apiType),
              fullWidth: true,
              prepend: (
                <EuiText
                  size={'s'}
                  style={{ backgroundColor: 'transparent', paddingRight: !hidePathParams && '0px' }}
                >
                  GET {API_TYPES_PREPEND_TEXT[apiType]}
                </EuiText>
              ),
              append: !_.isEmpty(API_TYPES_APPEND_TEXT[apiType]) && (
                <EuiText
                  size={'s'}
                  style={{ backgroundColor: 'transparent', paddingLeft: !hidePathParams && '0px' }}
                >
                  {API_TYPES_APPEND_TEXT[apiType]}
                </EuiText>
              ),
            }}
          />

          <EuiSpacer size={'l'} />
        </div>
      ) : null}

      <EuiButton
        disabled={disableRunButton}
        fill={false}
        isLoading={loadingResponse}
        onClick={onRunQuery}
        size={'s'}
      >
        Run for response
      </EuiButton>

      <EuiSpacer size={'l'} />

      <EuiFormRow label={'Response'}>
        <EuiCodeEditor
          mode={'json'}
          theme={isDarkMode ? 'sense-dark' : 'github'}
          height={'500px'}
          value={pathIsEmpty || loadingResponse ? undefined : response}
          readOnly
        />
      </EuiFormRow>
    </div>
  );
};

export default LocalUriInput;

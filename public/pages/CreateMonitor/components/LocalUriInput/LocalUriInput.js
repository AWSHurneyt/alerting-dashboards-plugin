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
import { EuiButton, EuiCodeEditor, EuiFormRow, EuiLink, EuiSpacer, EuiText } from '@elastic/eui';
import { isInvalidApiPath } from '../../../../utils/validate';
import { FormikComboBox, FormikFieldText } from '../../../../components/FormControls';
import {
  API_PATH_REQUIRED_PLACEHOLDER_TEXT,
  DEFAULT_SUPPORTED_API_OPTIONS,
  NO_PATH_PARAMS_PLACEHOLDER_TEXT,
  SUPPORTED_API_APPEND_TEXT,
  SUPPORTED_API_DOCUMENTATION,
  SUPPORTED_API_ENUM,
  SUPPORTED_API_EXAMPLE_TEXT,
  SUPPORTED_API_LABELS,
  SUPPORTED_API_PATHS,
  SUPPORTED_API_PREPEND_TEXT,
} from './utils/localUriConstants';
import { isInvalidApiPathParameter, validateApiPathParameter } from './utils/localUriHelpers';

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
  let selectedApiPath = _.get(values, 'uri.path');
  const pathIsEmpty = _.isEmpty(selectedApiPath);
  if (!pathIsEmpty) selectedApiPath = selectedApiPath[0].value || selectedApiPath;
  const pathParams = _.get(values, 'uri.pathParams', '');
  const noPathParams = _.isEmpty(_.get(SUPPORTED_API_PATHS, `${selectedApiPath}.withPathParams`));
  const disablePathParams = pathIsEmpty || loadingSupportedApiList || noPathParams;
  const requirePathParams = _.isEmpty(
    _.get(SUPPORTED_API_PATHS, `${selectedApiPath}.withoutPathParams`)
  );
  const disableRunButton = pathIsEmpty || (_.isEmpty(pathParams) && requirePathParams);
  if (disablePathParams) _.set(values, 'uri.pathParams', '');
  return (
    <Fragment>
      <EuiSpacer size={'m'} />

      <FormikComboBox
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
          error: API_PATH_REQUIRED_PLACEHOLDER_TEXT,
        }}
        inputProps={{
          placeholder: loadingSupportedApiList ? 'Loading API options' : 'Select an API',
          options: supportedApiList,
          onBlur: (e, field, form) => {
            form.setFieldTouched('uri.path');
          },
          onChange: (options, field, form) => {
            form.setFieldValue('uri.path', options);
            resetResponse();
          },
          isClearable: true,
          singleSelection: { asPlainText: true },
          selectedOptions: [
            {
              value: SUPPORTED_API_ENUM[selectedApiPath] || '',
              label: SUPPORTED_API_LABELS[selectedApiPath] || '',
            },
          ],
          isDisabled: loadingSupportedApiList,
          isLoading: loadingSupportedApiList,
        }}
      />

      <EuiSpacer size={'l'} />

      <FormikFieldText
        name={'uri.pathParams'}
        formRow
        fieldProps={{
          validate: validateApiPathParameter(pathParams, requirePathParams, disablePathParams),
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
                {SUPPORTED_API_LABELS[selectedApiPath] || 'selected'} API.{' '}
                {!pathIsEmpty && !_.isEmpty(SUPPORTED_API_DOCUMENTATION[selectedApiPath]) && (
                  <EuiLink
                    external
                    href={SUPPORTED_API_DOCUMENTATION[selectedApiPath]}
                    target={'_blank'}
                  >
                    Learn more
                  </EuiLink>
                )}
              </EuiText>
            </div>
          ),
          style: { maxWidth: '600px' },
          isInvalid: isInvalidApiPathParameter(pathParams, requirePathParams, disablePathParams),
          error: validateApiPathParameter(pathParams, requirePathParams, disablePathParams),
        }}
        inputProps={{
          placeholder: pathIsEmpty
            ? 'Enter remaining path components and path parameters'
            : disablePathParams
            ? NO_PATH_PARAMS_PLACEHOLDER_TEXT
            : `e.g., ${SUPPORTED_API_EXAMPLE_TEXT[selectedApiPath]}`,
          disabled: disablePathParams,
          fullWidth: true,
          prepend: (
            <EuiText
              size={'s'}
              style={{ backgroundColor: 'transparent', paddingRight: !disablePathParams && '0px' }}
            >
              GET {SUPPORTED_API_PREPEND_TEXT[selectedApiPath]}
            </EuiText>
          ),
          append: !_.isEmpty(SUPPORTED_API_APPEND_TEXT[selectedApiPath]) && (
            <EuiText
              size={'s'}
              style={{ backgroundColor: 'transparent', paddingLeft: !disablePathParams && '0px' }}
            >
              {SUPPORTED_API_APPEND_TEXT[selectedApiPath]}
            </EuiText>
          ),
        }}
      />

      <EuiSpacer size={'l'} />

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
          width={'400px'}
          height={'500px'}
          value={pathIsEmpty || loadingResponse ? undefined : response}
          readOnly
        />
      </EuiFormRow>
    </Fragment>
  );
};

export default LocalUriInput;

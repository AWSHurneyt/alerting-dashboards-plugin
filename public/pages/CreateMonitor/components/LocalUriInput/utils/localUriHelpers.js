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

import _ from 'lodash';
import { formikToLocalUri } from '../../../containers/CreateMonitor/utils/formikToMonitor';
import {
  DEFAULT_LOCAL_URI_SCRIPT,
  ILLEGAL_PATH_PARAMETER_CHARACTERS,
  PATH_PARAMETER_ILLEGAL_CHARACTER_TEXT,
  PATH_PARAMETERS_REQUIRED_TEXT,
  API_TYPES_EXAMPLE_TEXT,
  API_TYPES_PATHS,
} from './localUriConstants';
import { SEARCH_TYPE } from '../../../../../utils/constants';
import { FORMIK_INITIAL_TRIGGER_VALUES } from '../../../../CreateTrigger/containers/CreateTrigger/utils/constants';
import { FORMIK_INITIAL_VALUES } from '../../../containers/CreateMonitor/utils/constants';

export function buildLocalUriRequest(values) {
  return _.get(formikToLocalUri(values), 'uri');
}

export const canExecuteLocalUriMonitor = (uri = {}) => {
  const {
    api_type = FORMIK_INITIAL_VALUES.uri.api_type,
    path_params = FORMIK_INITIAL_VALUES.uri.path_params,
  } = uri;
  if (_.isEmpty(api_type)) return false;
  const requirePathParams = _.isEmpty(_.get(API_TYPES_PATHS, `${api_type}.withoutPathParams`));
  return requirePathParams ? !_.isEmpty(path_params) : true;
};

export const getApiPath = (hasPathParams = false, apiType) => {
  return hasPathParams
    ? _.get(
        API_TYPES_PATHS,
        `${apiType}.withPathParams`,
        _.get(API_TYPES_PATHS, `${apiType}.withoutPathParams`)
      )
    : _.get(API_TYPES_PATHS, `${apiType}.withoutPathParams`);
};

export const getExamplePathParams = (apiType) => `e.g., ${API_TYPES_EXAMPLE_TEXT[apiType]}`;

export const getSelectedApiEnum = (uri) => {
  let path = _.get(uri, 'path');
  let apiEnum = '';
  _.keys(API_TYPES_PATHS).forEach((apiKey) => {
    const withPathParams = _.get(API_TYPES_PATHS, `${apiKey}.withPathParams`);
    const withoutPathParams = _.get(API_TYPES_PATHS, `${apiKey}.withoutPathParams`);
    if (path === withPathParams || path === withoutPathParams) apiEnum = apiKey;
  });
  return apiEnum;
};

export const getDefaultScript = (executeResponse, searchType) => {
  if (searchType === SEARCH_TYPE.LOCAL_URI) {
    if (_.isEmpty(executeResponse)) return DEFAULT_LOCAL_URI_SCRIPT;
    const response = _.get(executeResponse, 'input_results.results[0]');
    return { ...DEFAULT_LOCAL_URI_SCRIPT, source: `ctx.results[0].${_.keys(response)[0]} != null` };
  }
  return FORMIK_INITIAL_TRIGGER_VALUES.script;
};

export const isInvalidApiPathParameter = (pathParams, requirePathParams, disablePathParams) => (
  value,
  field,
  form
) => {
  const pathParamsTouched = _.get(field, 'touched.uri.path_params', false);
  if (pathParamsTouched) {
    if (disablePathParams) return false;
    if (requirePathParams && _.isEmpty(pathParams)) return true;
    const foundIllegalCharacters = ILLEGAL_PATH_PARAMETER_CHARACTERS.find((illegalCharacter) =>
      _.includes(pathParams, illegalCharacter)
    );
    return !_.isEmpty(foundIllegalCharacters);
  } else return pathParamsTouched;
};

export const validateApiPathParameter = (pathParams, requirePathParams, disablePathParams) => {
  if (requirePathParams && _.isEmpty(pathParams)) return PATH_PARAMETERS_REQUIRED_TEXT;
  if (isInvalidApiPathParameter(pathParams, requirePathParams, disablePathParams))
    return PATH_PARAMETER_ILLEGAL_CHARACTER_TEXT;
};

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
  ILLEGAL_PATH_PARAMETER_CHARACTERS,
  PATH_PARAMETER_ILLEGAL_CHARACTER_TEXT,
  PATH_PARAMETERS_REQUIRED_TEXT,
  SUPPORTED_API_APPEND_TEXT,
  SUPPORTED_API_PATHS,
} from './localUriConstants';

export function buildLocalUriRequest(values) {
  return _.get(formikToLocalUri(values), 'uri');
}

export const getApiPath = (hasPathParams = false, selectedPath) => {
  return hasPathParams
    ? _.get(
        SUPPORTED_API_PATHS,
        `${selectedPath}.withPathParams`,
        _.get(SUPPORTED_API_PATHS, `${selectedPath}.withoutPathParams`)
      )
    : _.get(SUPPORTED_API_PATHS, `${selectedPath}.withoutPathParams`);
};

export const getSelectedApiEnum = (uri) => {
  const path = _.get(uri, 'path');
  let apiEnum = '';
  _.keys(SUPPORTED_API_PATHS).forEach((apiKey) => {
    const withPathParams = _.get(SUPPORTED_API_PATHS, `${apiKey}.withPathParams`);
    const withoutPathParams = _.get(SUPPORTED_API_PATHS, `${apiKey}.withoutPathParams`);
    if (apiEnum === apiKey) {
      _.keys(SUPPORTED_API_APPEND_TEXT).forEach((appendKey) => {
        const appendValue = _.get(SUPPORTED_API_APPEND_TEXT, appendKey);
        if (!_.isEmpty(appendValue) && _.endsWith(appendValue, path)) apiEnum = appendKey;
      });
    } else {
      if (path === withPathParams || path === withoutPathParams) apiEnum = apiKey;
    }
  });
  return apiEnum;
};

export const isInvalidApiPathParameter = (pathParams, requirePathParams, disablePathParams) => {
  if (disablePathParams) return false;
  if (requirePathParams && _.isEmpty(pathParams)) return true;
  const foundIllegalCharacters = ILLEGAL_PATH_PARAMETER_CHARACTERS.find((illegalCharacter) =>
    _.includes(pathParams, illegalCharacter)
  );
  return !_.isEmpty(foundIllegalCharacters);
};

export const validateApiPathParameter = (pathParams, requirePathParams, disablePathParams) => {
  if (requirePathParams && _.isEmpty(pathParams)) return PATH_PARAMETERS_REQUIRED_TEXT;
  if (isInvalidApiPathParameter(pathParams, requirePathParams, disablePathParams))
    return PATH_PARAMETER_ILLEGAL_CHARACTER_TEXT;
};

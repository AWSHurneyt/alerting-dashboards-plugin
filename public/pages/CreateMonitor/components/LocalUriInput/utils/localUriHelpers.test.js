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
import { SUPPORTED_API_ENUM, SUPPORTED_API_PATHS } from './localUriConstants';
import { getApiPath } from './localUriHelpers';

describe('localUriHelpers', () => {
  describe('buildLocalUriRequest', () => {
    test('', () => {});
  });

  describe('getApiPath', () => {
    _.keys(SUPPORTED_API_ENUM).forEach((key) => {
      test(`for ${key} when hasPathParams is false`, () => {
        const withoutPathParams = _.get(SUPPORTED_API_PATHS, `${key}.withoutPathParams`);
        const withoutPathParamsResult = getApiPath(false, key);
        expect(withoutPathParamsResult).toEqual(withoutPathParams);
      });
      test(`for ${key} when hasPathParams is true`, () => {
        const withPathParams = _.get(SUPPORTED_API_PATHS, `${key}.withPathParams`);
        const withPathParamsResult = getApiPath(true, key);
        expect(withPathParamsResult).toEqual(withPathParams);
      });
    });
  });

  describe('getSelectedApiEnum', () => {});

  describe('isInvalidApiPathParameter', () => {});

  describe('validateApiPathParameter', () => {});
});

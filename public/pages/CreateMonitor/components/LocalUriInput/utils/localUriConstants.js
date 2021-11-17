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
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import _ from 'lodash';

export const API_PATH_REQUIRED_PLACEHOLDER_TEXT = 'Select an API.';
export const EMPTY_PATH_PARAMS_TEXT = 'Enter remaining path components and path parameters';
export const GET_API_TYPE_DEBUG_TEXT =
  'Cannot determine ApiType in localUriHelpers::getSelectedApiType.';
export const ILLEGAL_PATH_PARAMETER_CHARACTERS = ['=', '?', '"', ' '];
export const NO_PATH_PARAMS_PLACEHOLDER_TEXT = 'No path parameter options';
export const PATH_PARAMETER_ILLEGAL_CHARACTER_TEXT = `The provided path parameters contain invalid characters or spaces. Please omit: ${ILLEGAL_PATH_PARAMETER_CHARACTERS.join(
  ' '
)}`;
export const PATH_PARAMETERS_REQUIRED_TEXT = 'Path parameters are required for this API.';
export const REST_API_REFERENCE = 'https://opensearch.org/docs/latest/opensearch/rest-api/index/';
export const DEFAULT_LOCAL_URI_SCRIPT = { lang: 'painless', source: 'ctx.results[0] != null' };

export const API_TYPES = {
  CLUSTER_HEALTH: 'CLUSTER_HEALTH',
  CLUSTER_STATS: 'CLUSTER_STATS',
  CLUSTER_SETTINGS: 'CLUSTER_SETTINGS',
  NODES_STATS: 'NODES_STATS',
  CAT_PENDING_TASKS: 'CAT_PENDING_TASKS',
  CAT_RECOVERY: 'CAT_RECOVERY',
  CAT_REPOSITORIES: 'CAT_REPOSITORIES',
  CAT_SNAPSHOTS: 'CAT_SNAPSHOTS',
  CAT_TASKS: 'CAT_TASKS',
};

export const API_TYPES_LABELS = {
  [API_TYPES.CLUSTER_HEALTH]: 'Cluster Health',
  [API_TYPES.CLUSTER_STATS]: 'Cluster Stats',
  [API_TYPES.CLUSTER_SETTINGS]: 'Cluster Settings',
  [API_TYPES.NODES_STATS]: 'Nodes Stats',
  [API_TYPES.CAT_PENDING_TASKS]: 'CAT Pending Tasks',
  [API_TYPES.CAT_RECOVERY]: 'CAT Recovery',
  [API_TYPES.CAT_REPOSITORIES]: 'CAT Repositories',
  [API_TYPES.CAT_SNAPSHOTS]: 'CAT Snapshots',
  [API_TYPES.CAT_TASKS]: 'CAT Tasks',
};

export const API_TYPES_PATHS = {
  [API_TYPES.CAT_PENDING_TASKS]: {
    withoutPathParams: '_cat/pending_tasks',
  },
  [API_TYPES.CAT_RECOVERY]: {
    withPathParams: '_cat/recovery/',
    withoutPathParams: '_cat/recovery',
  },
  [API_TYPES.CAT_REPOSITORIES]: {
    withoutPathParams: '_cat/repositories',
  },
  [API_TYPES.CAT_SNAPSHOTS]: {
    withPathParams: '_cat/snapshots/',
  },
  [API_TYPES.CAT_TASKS]: {
    withoutPathParams: '_cat/tasks',
  },
  [API_TYPES.CLUSTER_HEALTH]: {
    withPathParams: '_cluster/health/',
    withoutPathParams: '_cluster/health',
  },
  [API_TYPES.CLUSTER_STATS]: {
    withPathParams: '_cluster/stats/nodes/',
    withoutPathParams: '_cluster/stats',
  },
  [API_TYPES.CLUSTER_SETTINGS]: {
    withoutPathParams: '_cluster/settings',
  },
  [API_TYPES.NODES_STATS]: {
    withoutPathParams: '_nodes/stats',
  },
};

export const API_TYPES_DOCUMENTATION = {
  [API_TYPES.CLUSTER_HEALTH]:
    'https://opensearch.org/docs/latest/opensearch/rest-api/cluster-health/',
  [API_TYPES.CLUSTER_STATS]: '',
  [API_TYPES.CLUSTER_SETTINGS]:
    'https://opensearch.org/docs/latest/opensearch/rest-api/cluster-settings/',
  [API_TYPES.NODES_STATS]:
    'https://opensearch.org/docs/latest/opensearch/popular-api/#get-node-statistics',
  [API_TYPES.CAT_PENDING_TASKS]:
    'https://opensearch.org/docs/latest/opensearch/rest-api/cat/cat-pending-tasks/',
  [API_TYPES.CAT_RECOVERY]:
    'https://opensearch.org/docs/latest/opensearch/rest-api/cat/cat-recovery/',
  [API_TYPES.CAT_REPOSITORIES]:
    'https://opensearch.org/docs/latest/opensearch/rest-api/cat/cat-repositories/',
  [API_TYPES.CAT_SNAPSHOTS]:
    'https://opensearch.org/docs/latest/opensearch/rest-api/cat/cat-snapshots/',
  [API_TYPES.CAT_TASKS]: 'https://opensearch.org/docs/latest/opensearch/rest-api/cat/cat-tasks/',
};

export const API_TYPES_EXAMPLE_TEXT = {
  [API_TYPES.CLUSTER_HEALTH]: 'indexAlias1,indexAlias2...',
  [API_TYPES.CLUSTER_STATS]: 'nodeFilter1,nodeFilter2...',
  [API_TYPES.CAT_RECOVERY]: 'index1,index2...',
  [API_TYPES.CAT_SNAPSHOTS]: 'repositoryName',
};

export const API_TYPES_PREPEND_TEXT = {
  [API_TYPES.CLUSTER_HEALTH]: _.get(
    API_TYPES_PATHS,
    `${API_TYPES.CLUSTER_HEALTH}.withPathParams`,
    _.get(API_TYPES_PATHS, `${API_TYPES.CLUSTER_HEALTH}.withoutPathParams`)
  ),
  [API_TYPES.CLUSTER_STATS]: _.get(
    API_TYPES_PATHS,
    `${API_TYPES.CLUSTER_STATS}.withPathParams`,
    _.get(API_TYPES_PATHS, `${API_TYPES.CLUSTER_STATS}.withoutPathParams`)
  ),
  [API_TYPES.CLUSTER_SETTINGS]: _.get(
    API_TYPES_PATHS,
    `${API_TYPES.CLUSTER_SETTINGS}.withPathParams`,
    _.get(API_TYPES_PATHS, `${API_TYPES.CLUSTER_SETTINGS}.withoutPathParams`)
  ),
  [API_TYPES.NODES_STATS]: _.get(
    API_TYPES_PATHS,
    `${API_TYPES.NODES_STATS}.withPathParams`,
    _.get(API_TYPES_PATHS, `${API_TYPES.NODES_STATS}.withoutPathParams`)
  ),
  [API_TYPES.CAT_PENDING_TASKS]: _.get(
    API_TYPES_PATHS,
    `${API_TYPES.CAT_PENDING_TASKS}.withPathParams`,
    _.get(API_TYPES_PATHS, `${API_TYPES.CAT_PENDING_TASKS}.withoutPathParams`)
  ),
  [API_TYPES.CAT_RECOVERY]: _.get(
    API_TYPES_PATHS,
    `${API_TYPES.CAT_RECOVERY}.withPathParams`,
    _.get(API_TYPES_PATHS, `${API_TYPES.CAT_RECOVERY}.withoutPathParams`)
  ),
  [API_TYPES.CAT_REPOSITORIES]: _.get(
    API_TYPES_PATHS,
    `${API_TYPES.CAT_REPOSITORIES}.withPathParams`,
    _.get(API_TYPES_PATHS, `${API_TYPES.CAT_REPOSITORIES}.withoutPathParams`)
  ),
  [API_TYPES.CAT_SNAPSHOTS]: _.get(
    API_TYPES_PATHS,
    `${API_TYPES.CAT_SNAPSHOTS}.withPathParams`,
    _.get(API_TYPES_PATHS, `${API_TYPES.CAT_SNAPSHOTS}.withoutPathParams`)
  ),
  [API_TYPES.CAT_TASKS]: _.get(
    API_TYPES_PATHS,
    `${API_TYPES.CAT_TASKS}.withPathParams`,
    _.get(API_TYPES_PATHS, `${API_TYPES.CAT_TASKS}.withoutPathParams`)
  ),
};

export const API_TYPES_APPEND_TEXT = {
  [API_TYPES.CAT_PENDING_TASKS]: '',
  [API_TYPES.CAT_RECOVERY]: '',
  [API_TYPES.CAT_REPOSITORIES]: '',
  [API_TYPES.CAT_SNAPSHOTS]: '',
  [API_TYPES.CAT_TASKS]: '',
  [API_TYPES.CLUSTER_HEALTH]: '',
  [API_TYPES.CLUSTER_STATS]: '',
  [API_TYPES.CLUSTER_SETTINGS]: '',
  [API_TYPES.NODES_STATS]: '',
};

export const DEFAULT_API_TYPE_OPTIONS = [
  { value: API_TYPES.CLUSTER_HEALTH, label: API_TYPES_LABELS.CLUSTER_HEALTH },
  { value: API_TYPES.CLUSTER_STATS, label: API_TYPES_LABELS.CLUSTER_STATS },
  { value: API_TYPES.CLUSTER_SETTINGS, label: API_TYPES_LABELS.CLUSTER_SETTINGS },
  { value: API_TYPES.NODES_STATS, label: API_TYPES_LABELS.NODES_STATS },
  { value: API_TYPES.CAT_PENDING_TASKS, label: API_TYPES_LABELS.CAT_PENDING_TASKS },
  { value: API_TYPES.CAT_RECOVERY, label: API_TYPES_LABELS.CAT_RECOVERY },
  { value: API_TYPES.CAT_REPOSITORIES, label: API_TYPES_LABELS.CAT_REPOSITORIES },
  { value: API_TYPES.CAT_SNAPSHOTS, label: API_TYPES_LABELS.CAT_SNAPSHOTS },
  { value: API_TYPES.CAT_TASKS, label: API_TYPES_LABELS.CAT_TASKS },
];

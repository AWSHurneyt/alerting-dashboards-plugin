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

import { getApiPath } from './localUriHelpers';
import _ from 'lodash';

export const API_PATH_REQUIRED_PLACEHOLDER_TEXT = 'Select an API.';
export const ILLEGAL_PATH_PARAMETER_CHARACTERS = ['?', '"', ' '];
export const NO_PATH_PARAMS_PLACEHOLDER_TEXT = 'No path parameter options';
export const PATH_PARAMETER_ILLEGAL_CHARACTER_TEXT = `The provided path parameters contain invalid characters or spaces. Please omit: ${ILLEGAL_PATH_PARAMETER_CHARACTERS.join(
  ' '
)}`;
export const PATH_PARAMETERS_REQUIRED_TEXT = 'Path parameters are required for this API.';

export const SUPPORTED_API_ENUM = {
  CLUSTER_HEALTH: 'CLUSTER_HEALTH',
  CLUSTER_STATS: 'CLUSTER_STATS',
  CLUSTER_SETTINGS: 'CLUSTER_SETTINGS',
  // TODO: For NODES_HOT_THREADS, determine what the response payload should look like.
  // NODES_HOT_THREADS: 'NODES_HOT_THREADS',
  NODES_STATS: 'NODES_STATS',
  CAT_ALIASES: 'CAT_ALIASES',
  CAT_PENDING_TASKS: 'CAT_PENDING_TASKS',
  CAT_RECOVERY: 'CAT_RECOVERY',
  CAT_REPOSITORIES: 'CAT_REPOSITORIES',
  CAT_SNAPSHOTS: 'CAT_SNAPSHOTS',
  CAT_TASKS: 'CAT_TASKS',
};

export const SUPPORTED_API_LABELS = {
  [SUPPORTED_API_ENUM.CLUSTER_HEALTH]: 'Cluster Health',
  [SUPPORTED_API_ENUM.CLUSTER_STATS]: 'Cluster Stats',
  [SUPPORTED_API_ENUM.CLUSTER_SETTINGS]: 'Cluster Settings',
  // TODO: For NODES_HOT_THREADS, determine what the response payload should look like.
  // [SUPPORTED_API_ENUM.NODES_HOT_THREADS]: 'Nodes Hot Threads',
  [SUPPORTED_API_ENUM.NODES_STATS]: 'Nodes Stats',
  [SUPPORTED_API_ENUM.CAT_ALIASES]: 'CAT Aliases',
  [SUPPORTED_API_ENUM.CAT_PENDING_TASKS]: 'CAT Pending Tasks',
  [SUPPORTED_API_ENUM.CAT_RECOVERY]: 'CAT Recovery',
  [SUPPORTED_API_ENUM.CAT_REPOSITORIES]: 'CAT Repositories',
  [SUPPORTED_API_ENUM.CAT_SNAPSHOTS]: 'CAT Snapshots',
  [SUPPORTED_API_ENUM.CAT_TASKS]: 'CAT Tasks',
};

export const SUPPORTED_API_PATHS = {
  [SUPPORTED_API_ENUM.CAT_ALIASES]: {
    withPathParams: '_cat/aliases/',
    withoutPathParams: '_cat/aliases',
  },
  [SUPPORTED_API_ENUM.CAT_PENDING_TASKS]: {
    withoutPathParams: '_cat/pending_tasks',
  },
  [SUPPORTED_API_ENUM.CAT_RECOVERY]: {
    withPathParams: '_cat/recovery/',
    withoutPathParams: '_cat/recovery',
  },
  [SUPPORTED_API_ENUM.CAT_REPOSITORIES]: {
    withoutPathParams: '_cat/repositories',
  },
  [SUPPORTED_API_ENUM.CAT_SNAPSHOTS]: {
    withPathParams: '_cat/snapshots/',
  },
  [SUPPORTED_API_ENUM.CAT_TASKS]: {
    withoutPathParams: '_cat/tasks',
  },
  [SUPPORTED_API_ENUM.CLUSTER_HEALTH]: {
    withPathParams: '_cluster/health/',
    withoutPathParams: '_cluster/health',
  },
  [SUPPORTED_API_ENUM.CLUSTER_STATS]: {
    withPathParams: '_cluster/stats/nodes/',
    withoutPathParams: '_cluster/stats',
  },
  [SUPPORTED_API_ENUM.CLUSTER_SETTINGS]: {
    withoutPathParams: '_cluster/settings',
  },
  // TODO: For NODES_HOT_THREADS, determine what the response payload should look like.
  // [SUPPORTED_API_ENUM.NODES_HOT_THREADS]: {
  //   withPathParams: '_nodes/',
  //   withoutPathParams: '_nodes/hot_threads'
  // },
  [SUPPORTED_API_ENUM.NODES_STATS]: {
    // withPathParams: '_nodes/', // TODO: Only supporting default API call for now. Implement logic for parsing various path params formats.
    withoutPathParams: '_nodes/stats',
  },
};

export const SUPPORTED_API_DOCUMENTATION = {
  [SUPPORTED_API_ENUM.CLUSTER_HEALTH]:
    'https://opensearch.org/docs/latest/opensearch/rest-api/cluster-health/',
  [SUPPORTED_API_ENUM.CLUSTER_STATS]: '',
  [SUPPORTED_API_ENUM.CLUSTER_SETTINGS]:
    'https://opensearch.org/docs/latest/opensearch/rest-api/cluster-settings/',
  // TODO: For NODES_HOT_THREADS, determine what the response payload should look like.
  // [SUPPORTED_API_ENUM.NODES_HOT_THREADS]: '',
  [SUPPORTED_API_ENUM.NODES_STATS]:
    'https://opensearch.org/docs/latest/opensearch/popular-api/#get-node-statistics',
  [SUPPORTED_API_ENUM.CAT_ALIASES]:
    'https://opensearch.org/docs/latest/opensearch/rest-api/cat/cat-aliases/',
  [SUPPORTED_API_ENUM.CAT_PENDING_TASKS]:
    'https://opensearch.org/docs/latest/opensearch/rest-api/cat/cat-pending-tasks/',
  [SUPPORTED_API_ENUM.CAT_RECOVERY]:
    'https://opensearch.org/docs/latest/opensearch/rest-api/cat/cat-recovery/',
  [SUPPORTED_API_ENUM.CAT_REPOSITORIES]:
    'https://opensearch.org/docs/latest/opensearch/rest-api/cat/cat-repositories/',
  [SUPPORTED_API_ENUM.CAT_SNAPSHOTS]:
    'https://opensearch.org/docs/latest/opensearch/rest-api/cat/cat-snapshots/',
  [SUPPORTED_API_ENUM.CAT_TASKS]:
    'https://opensearch.org/docs/latest/opensearch/rest-api/cat/cat-tasks/',
};

export const SUPPORTED_API_EXAMPLE_TEXT = {
  [SUPPORTED_API_ENUM.CLUSTER_HEALTH]: 'indexAlias1,indexAlias2...',
  [SUPPORTED_API_ENUM.CLUSTER_STATS]: 'nodeFilter1,nodeFilter2...',
  [SUPPORTED_API_ENUM.CLUSTER_SETTINGS]: NO_PATH_PARAMS_PLACEHOLDER_TEXT,
  // TODO: For NODES_HOT_THREADS, determine what the response payload should look like.
  // [SUPPORTED_API_ENUM.NODES_HOT_THREADS]: 'nodeID1,nodeID2...',
  [SUPPORTED_API_ENUM.NODES_STATS]: 'nodeID1,nodeID2.../stats/metric1,metric2.../indexMetric',
  [SUPPORTED_API_ENUM.CAT_ALIASES]: 'alias1,alias2...',
  [SUPPORTED_API_ENUM.CAT_RECOVERY]: 'index1,index2...',
  [SUPPORTED_API_ENUM.CAT_SNAPSHOTS]: 'repositoryName',
};

export const SUPPORTED_API_PREPEND_TEXT = {
  [SUPPORTED_API_ENUM.CLUSTER_HEALTH]: _.get(
    SUPPORTED_API_PATHS,
    `${SUPPORTED_API_ENUM.CLUSTER_HEALTH}.withPathParams`,
    _.get(SUPPORTED_API_PATHS, `${SUPPORTED_API_ENUM.CLUSTER_HEALTH}.withoutPathParams`)
  ),
  [SUPPORTED_API_ENUM.CLUSTER_STATS]: _.get(
    SUPPORTED_API_PATHS,
    `${SUPPORTED_API_ENUM.CLUSTER_STATS}.withPathParams`,
    _.get(SUPPORTED_API_PATHS, `${SUPPORTED_API_ENUM.CLUSTER_STATS}.withoutPathParams`)
  ),
  [SUPPORTED_API_ENUM.CLUSTER_SETTINGS]: _.get(
    SUPPORTED_API_PATHS,
    `${SUPPORTED_API_ENUM.CLUSTER_SETTINGS}.withPathParams`,
    _.get(SUPPORTED_API_PATHS, `${SUPPORTED_API_ENUM.CLUSTER_SETTINGS}.withoutPathParams`)
  ),
  // TODO: For NODES_HOT_THREADS, determine what the response payload should look like.
  // [SUPPORTED_API_ENUM.NODES_HOT_THREADS]: _.get(SUPPORTED_API_PATHS,
  //     `${SUPPORTED_API_ENUM.NODES_HOT_THREADS}.withPathParams`,
  //     _.get(SUPPORTED_API_PATHS, `${SUPPORTED_API_ENUM.NODES_HOT_THREADS}.withoutPathParams`)),
  [SUPPORTED_API_ENUM.NODES_STATS]: _.get(
    SUPPORTED_API_PATHS,
    `${SUPPORTED_API_ENUM.NODES_STATS}.withPathParams`,
    _.get(SUPPORTED_API_PATHS, `${SUPPORTED_API_ENUM.NODES_STATS}.withoutPathParams`)
  ),
  [SUPPORTED_API_ENUM.CAT_ALIASES]: _.get(
    SUPPORTED_API_PATHS,
    `${SUPPORTED_API_ENUM.CAT_ALIASES}.withPathParams`,
    _.get(SUPPORTED_API_PATHS, `${SUPPORTED_API_ENUM.CAT_ALIASES}.withoutPathParams`)
  ),
  [SUPPORTED_API_ENUM.CAT_PENDING_TASKS]: _.get(
    SUPPORTED_API_PATHS,
    `${SUPPORTED_API_ENUM.CAT_PENDING_TASKS}.withPathParams`,
    _.get(SUPPORTED_API_PATHS, `${SUPPORTED_API_ENUM.CAT_PENDING_TASKS}.withoutPathParams`)
  ),
  [SUPPORTED_API_ENUM.CAT_RECOVERY]: _.get(
    SUPPORTED_API_PATHS,
    `${SUPPORTED_API_ENUM.CAT_RECOVERY}.withPathParams`,
    _.get(SUPPORTED_API_PATHS, `${SUPPORTED_API_ENUM.CAT_RECOVERY}.withoutPathParams`)
  ),
  [SUPPORTED_API_ENUM.CAT_REPOSITORIES]: _.get(
    SUPPORTED_API_PATHS,
    `${SUPPORTED_API_ENUM.CAT_REPOSITORIES}.withPathParams`,
    _.get(SUPPORTED_API_PATHS, `${SUPPORTED_API_ENUM.CAT_REPOSITORIES}.withoutPathParams`)
  ),
  [SUPPORTED_API_ENUM.CAT_SNAPSHOTS]: _.get(
    SUPPORTED_API_PATHS,
    `${SUPPORTED_API_ENUM.CAT_SNAPSHOTS}.withPathParams`,
    _.get(SUPPORTED_API_PATHS, `${SUPPORTED_API_ENUM.CAT_SNAPSHOTS}.withoutPathParams`)
  ),
  [SUPPORTED_API_ENUM.CAT_TASKS]: _.get(
    SUPPORTED_API_PATHS,
    `${SUPPORTED_API_ENUM.CAT_TASKS}.withPathParams`,
    _.get(SUPPORTED_API_PATHS, `${SUPPORTED_API_ENUM.CAT_TASKS}.withoutPathParams`)
  ),
};

export const SUPPORTED_API_APPEND_TEXT = {
  [SUPPORTED_API_ENUM.CAT_ALIASES]: '',
  [SUPPORTED_API_ENUM.CAT_PENDING_TASKS]: '',
  [SUPPORTED_API_ENUM.CAT_RECOVERY]: '',
  [SUPPORTED_API_ENUM.CAT_REPOSITORIES]: '',
  [SUPPORTED_API_ENUM.CAT_SNAPSHOTS]: '',
  [SUPPORTED_API_ENUM.CAT_TASKS]: '',
  [SUPPORTED_API_ENUM.CLUSTER_HEALTH]: '',
  [SUPPORTED_API_ENUM.CLUSTER_STATS]: '',
  [SUPPORTED_API_ENUM.CLUSTER_SETTINGS]: '',
  // TODO: For NODES_HOT_THREADS, determine what the response payload should look like.
  // [SUPPORTED_API_ENUM.NODES_HOT_THREADS]: '/hot_threads',
  [SUPPORTED_API_ENUM.NODES_STATS]: '',
};

export const DEFAULT_SUPPORTED_API_OPTIONS = [
  { value: SUPPORTED_API_ENUM.CLUSTER_HEALTH, label: SUPPORTED_API_LABELS.CLUSTER_HEALTH },
  { value: SUPPORTED_API_ENUM.CLUSTER_STATS, label: SUPPORTED_API_LABELS.CLUSTER_STATS },
  { value: SUPPORTED_API_ENUM.CLUSTER_SETTINGS, label: SUPPORTED_API_LABELS.CLUSTER_SETTINGS },
  // TODO: For NODES_HOT_THREADS, determine what the response payload should look like.
  // { value: SUPPORTED_API_ENUM.NODES_HOT_THREADS, label: SUPPORTED_API_LABELS.NODE_HOT_THREADS },
  { value: SUPPORTED_API_ENUM.NODES_STATS, label: SUPPORTED_API_LABELS.NODES_STATS },
  { value: SUPPORTED_API_ENUM.CAT_ALIASES, label: SUPPORTED_API_LABELS.CAT_ALIASES },
  { value: SUPPORTED_API_ENUM.CAT_PENDING_TASKS, label: SUPPORTED_API_LABELS.CAT_PENDING_TASKS },
  { value: SUPPORTED_API_ENUM.CAT_RECOVERY, label: SUPPORTED_API_LABELS.CAT_RECOVERY },
  { value: SUPPORTED_API_ENUM.CAT_REPOSITORIES, label: SUPPORTED_API_LABELS.CAT_REPOSITORIES },
  { value: SUPPORTED_API_ENUM.CAT_SNAPSHOTS, label: SUPPORTED_API_LABELS.CAT_SNAPSHOTS },
  { value: SUPPORTED_API_ENUM.CAT_TASKS, label: SUPPORTED_API_LABELS.CAT_TASKS },
];

export const SUPPORTED_API_OPTIONS_REQUIRING_PATH_PARAMS = () => {
  const apiList = [];
  _.keys(SUPPORTED_API_PATHS).forEach((api) => {
    const withoutPathParams = _.get(SUPPORTED_API_PATHS, `${api}.withoutPathParams`, '');
    if (_.isEmpty(withoutPathParams))
      apiList.push({ value: SUPPORTED_API_ENUM[api], label: SUPPORTED_API_LABELS[api] });
  });
  return apiList;
};

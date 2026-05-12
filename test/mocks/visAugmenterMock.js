/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

module.exports = {
  fetchVisEmbeddable: jest.fn().mockResolvedValue(null),
  VisLayerTypes: {
    PointInTimeEvents: 'PointInTimeEvents',
  },
  VisLayerErrorTypes: {
    FETCH_FAILURE: 'FETCH_FAILURE',
    RESOURCE_DELETED: 'RESOURCE_DELETED',
  },
};

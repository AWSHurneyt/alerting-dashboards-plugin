/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Formik } from 'formik';

jest.mock('../../../../../components/FormControls', () => ({
  FormikComboBox: () => null,
}));
jest.mock('../../../../../utils/constants', () => ({
  MONITOR_TYPE: { QUERY_LEVEL: 'monitor', DOC_LEVEL: 'doc_level_monitor' },
}));
jest.mock('../../../../../utils/validate', () => ({
  validateIndex: jest.fn(),
}));
jest.mock('../../../../utils/helpers', () => ({
  getDataSourceId: jest.fn(() => undefined),
  getDataSourceQueryObj: jest.fn(() => null),
  dataSourceEnabled: jest.fn(() => false),
}));

import { CrossClusterConfiguration } from './CrossClusterConfiguration';

const defaultProps = {
  httpClient: {
    get: jest.fn().mockResolvedValue({
      ok: true,
      resp: { local: { connected: true, cluster_name: 'local' } },
    }),
  },
  formik: {
    values: { index: [], clusterNames: [], monitor_type: 'monitor' },
    setFieldValue: jest.fn(),
  },
  clusterNames: [],
  localClusterName: 'local',
};

describe('CrossClusterConfiguration', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders and fetches cluster info on mount', async () => {
    const { container } = render(
      <Formik initialValues={{ index: [], clusterNames: [] }} onSubmit={() => {}}>
        <CrossClusterConfiguration {...defaultProps} />
      </Formik>
    );
    await waitFor(() => {
      expect(defaultProps.httpClient.get).toHaveBeenCalled();
    });
    expect(container).toBeTruthy();
  });

  test('handles cluster info fetch failure', async () => {
    const httpClient = { get: jest.fn().mockRejectedValue(new Error('network')) };
    const { container } = render(
      <Formik initialValues={{ index: [], clusterNames: [] }} onSubmit={() => {}}>
        <CrossClusterConfiguration {...defaultProps} httpClient={httpClient} />
      </Formik>
    );
    await waitFor(() => {
      expect(httpClient.get).toHaveBeenCalled();
    });
    expect(container).toBeTruthy();
  });
});

/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Formik } from 'formik';
import { render, waitFor } from '@testing-library/react';

import {
  notificationServiceMock,
  httpServiceMock,
} from '../../../../../../../../src/core/public/mocks';
import { FORMIK_INITIAL_VALUES } from '../../CreateMonitor/utils/constants';
import AnomalyDetectors from '../AnomalyDetectors';
import { CoreContext } from '../../../../../utils/CoreContext';
import { setClient, setNotifications } from '../../../../../services';

const renderEmptyMessage = jest.fn();

describe('AnomalyDetectors', () => {
  const notifications = notificationServiceMock.createStartContract();
  setNotifications(notifications);
  // Use the same httpClient instance for both setClient and assertions
  const httpClient = httpServiceMock.createStartContract();
  setClient(httpClient);

  beforeEach(() => {
    jest.clearAllMocks();
    httpClient.post.mockResolvedValue({ ok: true, detectors: [] });
  });

  test('renders', () => {
    const { container } = render(
      <CoreContext.Provider value={{ http: httpClient }}>
        <Formik initialValues={FORMIK_INITIAL_VALUES} onSubmit={() => {}}>
          {({ values }) => (
            <AnomalyDetectors values={values} renderEmptyMessage={renderEmptyMessage} />
          )}
        </Formik>
      </CoreContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  test('should be able to select the detector', async () => {
    httpClient.post.mockResolvedValue({
      ok: true,
      detectors: [{ id: 'det-1', name: 'Test Detector', indices: ['index-1'] }],
    });

    const { container } = render(
      <CoreContext.Provider value={{ http: httpClient }}>
        <Formik initialValues={FORMIK_INITIAL_VALUES} onSubmit={() => {}}>
          {({ values }) => (
            <AnomalyDetectors values={values} renderEmptyMessage={renderEmptyMessage} />
          )}
        </Formik>
      </CoreContext.Provider>
    );

    await waitFor(() => {
      expect(httpClient.post).toHaveBeenCalledWith(
        '../api/alerting/detectors/_search',
        expect.anything()
      );
    });
  });

  test('refetches detectors when landingDataSourceId changes', async () => {
    const { rerender } = render(
      <CoreContext.Provider value={{ http: httpClient }}>
        <Formik initialValues={FORMIK_INITIAL_VALUES} onSubmit={() => {}}>
          {({ values }) => (
            <AnomalyDetectors
              values={values}
              renderEmptyMessage={renderEmptyMessage}
              landingDataSourceId="ds-1"
            />
          )}
        </Formik>
      </CoreContext.Provider>
    );

    await waitFor(() => {
      expect(httpClient.post).toHaveBeenCalled();
    });

    httpClient.post.mockClear();

    rerender(
      <CoreContext.Provider value={{ http: httpClient }}>
        <Formik initialValues={FORMIK_INITIAL_VALUES} onSubmit={() => {}}>
          {({ values }) => (
            <AnomalyDetectors
              values={values}
              renderEmptyMessage={renderEmptyMessage}
              landingDataSourceId="ds-2"
            />
          )}
        </Formik>
      </CoreContext.Provider>
    );

    await waitFor(() => {
      expect(httpClient.post).toHaveBeenCalled();
    });
  });
});

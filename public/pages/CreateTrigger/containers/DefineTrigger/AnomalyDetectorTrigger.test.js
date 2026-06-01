/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';
import {
  notificationServiceMock,
  httpServiceMock,
} from '../../../../../../../src/core/public/mocks';
import { AnomalyDetectorTrigger } from './AnomalyDetectorTrigger';
import { CoreContext } from '../../../../../public/utils/CoreContext';
import { setClient, setNotifications } from '../../../../services';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AnomalyDetectorTrigger', () => {
  const notifications = notificationServiceMock.createStartContract();
  setNotifications(notifications);
  const httpClient = httpServiceMock.createStartContract();
  setClient(httpClient);

  test('renders no feature', () => {
    const { container } = render(
      <CoreContext.Provider value={{ http: httpClient }}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AnomalyDetectorTrigger detectorId="tempId" />
        </Formik>
      </CoreContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  test('renders no detector id', () => {
    const { container } = render(
      <CoreContext.Provider value={{ http: httpClient }}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AnomalyDetectorTrigger />
        </Formik>
      </CoreContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  test('renders no enabled feature', () => {
    const { container } = render(
      <CoreContext.Provider value={{ http: httpClient }}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AnomalyDetectorTrigger detectorId="tempId" />
        </Formik>
      </CoreContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  test('renders error', () => {
    const { container } = render(
      <CoreContext.Provider value={{ http: httpClient }}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AnomalyDetectorTrigger detectorId="tempId" error="Something went wrong" />
        </Formik>
      </CoreContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  test('renders preview sparse data', () => {
    const { container } = render(
      <CoreContext.Provider value={{ http: httpClient }}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AnomalyDetectorTrigger
            detectorId="tempId"
            adValues={{
              anomalyGradeThresholdValue: 0.7,
              anomalyGradeThresholdEnum: 'ABOVE',
              anomalyConfidenceThresholdValue: 0.7,
              anomalyConfidenceThresholdEnum: 'ABOVE',
            }}
          />
        </Formik>
      </CoreContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  test('feature has priority over preview error', () => {
    const { container } = render(
      <CoreContext.Provider value={{ http: httpClient }}>
        <Formik initialValues={{}} onSubmit={() => {}}>
          <AnomalyDetectorTrigger detectorId="tempId" error="error" />
        </Formik>
      </CoreContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });
});

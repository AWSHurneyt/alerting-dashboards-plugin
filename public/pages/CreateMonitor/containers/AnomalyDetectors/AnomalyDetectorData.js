/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { AD_PREVIEW_DAYS, DEFAULT_PREVIEW_ERROR_MSG } from '../../../../utils/constants';
import { backendErrorNotification } from '../../../../utils/helpers';
import { getClient, getNotifications } from '../../../../services';
import { getDataSourceId } from '../../../utils/helpers';

const getPreviewErrorMessage = (err) => {
  if (typeof err === 'string') return err;
  if (err) {
    if (err.msg === 'Bad Request') return err.response || DEFAULT_PREVIEW_ERROR_MSG;
    if (err.msg) return err.msg;
  }
  return DEFAULT_PREVIEW_ERROR_MSG;
};

const AnomalyDetectorData = ({ detectorId, startTime, endTime, preview = true, render }) => {
  const [state, setState] = useState({
    anomalyResult: { anomalies: [], featureData: {} },
    detector: { featureAttributes: [] },
    previewStartTime: 0,
    previewEndTime: 0,
    isLoading: false,
    error: '',
  });

  useEffect(() => {
    const getPreviewData = async () => {
      if (!detectorId) return;
      const httpClient = getClient();
      const notifications = getNotifications();
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const dataSourceId = getDataSourceId();
        const query = {
          ...(dataSourceId !== undefined && { dataSourceId }),
          startTime,
          endTime,
          preview,
        };
        const response = await httpClient.get(`../api/alerting/detectors/${detectorId}/results`, {
          query,
        });
        if (response.ok) {
          const { anomalyResult, detector } = response.response;
          setState((prev) => ({
            ...prev,
            anomalyResult,
            detector,
            previewStartTime: startTime,
            previewEndTime: endTime,
            isLoading: false,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: getPreviewErrorMessage(response.error),
          }));
          backendErrorNotification(notifications, 'get', 'detector results', response.error);
        }
      } catch (err) {
        console.error('Unable to get detectorResults', err);
        setState((prev) => ({ ...prev, isLoading: false, error: err }));
      }
    };

    getPreviewData();
  }, [detectorId]);

  return render({ ...state });
};

AnomalyDetectorData.propTypes = {
  detectorId: PropTypes.string.isRequired,
  preview: PropTypes.bool,
  render: PropTypes.func.isRequired,
};
AnomalyDetectorData.defaultProps = {
  preview: true,
  startTime: moment().subtract(AD_PREVIEW_DAYS, 'd').valueOf(),
  endTime: moment().valueOf(),
};

export { AnomalyDetectorData };

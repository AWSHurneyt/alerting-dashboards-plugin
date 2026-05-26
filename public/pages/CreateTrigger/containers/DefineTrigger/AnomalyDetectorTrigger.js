/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import _ from 'lodash';
import { EuiSpacer } from '@elastic/eui';
import { AnomalyDetectorData } from '../../../CreateMonitor/containers/AnomalyDetectors/AnomalyDetectorData';
import TriggerExpressions from '../../components/TriggerExpressions';
import { AnomaliesChart } from '../../../CreateMonitor/components/AnomalyDetectors/AnomaliesChart';
import { EmptyFeaturesMessage } from '../../../CreateMonitor/components/AnomalyDetectors/EmptyFeaturesMessage/EmptyFeaturesMessage';
import { EmptyDetectorMessage } from '../../../CreateMonitor/components/AnomalyDetectors/EmptyDetectorMessage/EmptyDetectorMessage';
import { PREVIEW_ERROR_TYPE } from '../../../../utils/constants';

function getPreviewErrorType(err, features) {
  if (features === undefined || features.length == 0) {
    return PREVIEW_ERROR_TYPE.NO_FEATURE;
  }
  const enabledFeatures = features.filter((feature) => feature.featureEnabled);
  if (enabledFeatures.length == 0) {
    return PREVIEW_ERROR_TYPE.NO_ENABLED_FEATURES;
  }
  if (err) return PREVIEW_ERROR_TYPE.PREVIEW_EXCEPTION;
  return PREVIEW_ERROR_TYPE.SPARSE_DATA;
}

const AnomalyDetectorTrigger = ({ adValues, detectorId, fieldPath, flyoutMode }) => (
  <div style={flyoutMode ? {} : { padding: '0px 10px' }}>
    <AnomalyDetectorData
      detectorId={detectorId}
      render={(anomalyData) => {
        const features = _.get(anomalyData, 'detector.featureAttributes', []);
        const isHCDetector = !_.isEmpty(_.get(anomalyData, 'detector.categoryField', []));
        const previewErrorType = getPreviewErrorType(anomalyData.error, features);

        if (_.get(anomalyData, 'anomalyResult.anomalies', []).length > 0) {
          return (
            <React.Fragment>
              <TriggerExpressions
                thresholdValue={adValues.anomalyGradeThresholdValue}
                thresholdEnum={adValues.anomalyGradeThresholdEnum}
                keyFieldName={`${fieldPath}anomalyDetector.anomalyGradeThresholdEnum`}
                valueFieldName={`${fieldPath}anomalyDetector.anomalyGradeThresholdValue`}
                label="Anomaly grade threshold"
              />
              {!flyoutMode && (
                <>
                  <EuiSpacer size="xs" />
                  <AnomaliesChart
                    showTitle={false}
                    showSettings={false}
                    startDateTime={anomalyData.previewStartTime}
                    endDateTime={anomalyData.previewEndTime}
                    anomalies={anomalyData.anomalyResult.anomalies}
                    isLoading={anomalyData.isLoading}
                    displayGrade
                    annotationData={[{ dataValue: adValues.anomalyGradeThresholdValue }]}
                  />
                </>
              )}
              <EuiSpacer size="m" />
              <TriggerExpressions
                thresholdValue={adValues.anomalyConfidenceThresholdValue}
                thresholdEnum={adValues.anomalyConfidenceThresholdEnum}
                keyFieldName={`${fieldPath}anomalyDetector.anomalyConfidenceThresholdEnum`}
                valueFieldName={`${fieldPath}anomalyDetector.anomalyConfidenceThresholdValue`}
                label="Anomaly confidence threshold"
              />
              {!flyoutMode && (
                <>
                  <EuiSpacer size="xs" />
                  <AnomaliesChart
                    showTitle={false}
                    showSettings={false}
                    startDateTime={anomalyData.previewStartTime}
                    endDateTime={anomalyData.previewEndTime}
                    anomalies={anomalyData.anomalyResult.anomalies}
                    isLoading={anomalyData.isLoading}
                    displayConfidence
                    annotationData={[{ dataValue: adValues.anomalyConfidenceThresholdValue }]}
                  />
                </>
              )}
            </React.Fragment>
          );
        } else if (_.isEmpty(detectorId)) {
          return <EmptyDetectorMessage />;
        } else if (
          previewErrorType === PREVIEW_ERROR_TYPE.EXCEPTION ||
          previewErrorType === PREVIEW_ERROR_TYPE.SPARSE_DATA
        ) {
          return (
            <React.Fragment>
              <TriggerExpressions
                thresholdValue={adValues.anomalyGradeThresholdValue}
                thresholdEnum={adValues.anomalyGradeThresholdEnum}
                keyFieldName={`${fieldPath}anomalyDetector.anomalyGradeThresholdEnum`}
                valueFieldName={`${fieldPath}anomalyDetector.anomalyGradeThresholdValue`}
                label="Anomaly grade threshold"
              />
              <EuiSpacer size="m" />
              <TriggerExpressions
                thresholdValue={adValues.anomalyConfidenceThresholdValue}
                thresholdEnum={adValues.anomalyConfidenceThresholdEnum}
                keyFieldName={`${fieldPath}anomalyDetector.anomalyConfidenceThresholdEnum`}
                valueFieldName={`${fieldPath}anomalyDetector.anomalyConfidenceThresholdValue`}
                label="Anomaly confidence threshold"
              />
            </React.Fragment>
          );
        } else {
          return (
            <EmptyFeaturesMessage
              detectorId={detectorId}
              isLoading={anomalyData.isLoading}
              error={anomalyData.error}
              isHCDetector={isHCDetector}
              previewErrorType={previewErrorType}
            />
          );
        }
      }}
    />
  </div>
);

export { AnomalyDetectorTrigger };

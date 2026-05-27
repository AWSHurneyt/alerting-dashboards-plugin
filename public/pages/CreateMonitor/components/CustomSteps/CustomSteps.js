/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { EuiPanel, EuiAccordion, EuiTitle } from '@elastic/eui';
import './CustomSteps.scss';

const CustomSteps = ({ steps }) => {
  const stepRefs = useRef({});
  const [lineHeights, setLineHeights] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      const newLineHeights = {};
      for (let i = 0; i < steps.length - 1; i++) {
        const currentRef = stepRefs.current[`step-${i}`];
        const nextRef = stepRefs.current[`step-${i + 1}`];
        if (currentRef && nextRef) {
          const currentCircle = currentRef.querySelector('.custom-step-circle');
          const nextCircle = nextRef.querySelector('.custom-step-circle');
          if (currentCircle && nextCircle) {
            const currentRect = currentCircle.getBoundingClientRect();
            const nextRect = nextCircle.getBoundingClientRect();
            newLineHeights[`line-${i}`] = Math.max(nextRect.top - currentRect.bottom, 20);
          }
        }
      }
      setLineHeights(newLineHeights);
    }, 100);
    return () => clearTimeout(timer);
  }, [steps]);

  return (
    <div className="custom-steps-container">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const lineHeight = lineHeights[`line-${index}`] || 100;

        return (
          <div
            key={`step-${index}`}
            className="custom-step-wrapper"
            ref={(el) => {
              stepRefs.current[`step-${index}`] = el;
            }}
          >
            <div className="custom-step-number-column">
              <div className="custom-step-circle">{index + 1}</div>
              {!isLast && (
                <div className="custom-connecting-line" style={{ height: `${lineHeight}px` }} />
              )}
            </div>

            <div className="custom-step-content-column">
              <EuiPanel hasBorder paddingSize="none">
                <EuiAccordion
                  id={`customStep-${index}`}
                  initialIsOpen={true}
                  paddingSize="none"
                  arrowDisplay="left"
                  className="create-monitor-step-panel"
                  buttonContent={
                    <div style={{ padding: '8px 0px 4px 12px' }}>
                      <EuiTitle size="s">
                        <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                          {step.title}
                        </h2>
                      </EuiTitle>
                    </div>
                  }
                >
                  <div style={{ paddingLeft: '64px', paddingRight: '16px', paddingBottom: '16px' }}>
                    {step.children}
                  </div>
                </EuiAccordion>
              </EuiPanel>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomSteps;

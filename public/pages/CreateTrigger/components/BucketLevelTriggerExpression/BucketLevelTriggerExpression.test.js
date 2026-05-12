/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';
import BucketLevelTriggerExpression from './BucketLevelTriggerExpression';

describe('BucketLevelTriggerExpression', () => {
  test('renders', () => {
    const { container } = render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        <BucketLevelTriggerExpression />
      </Formik>
    );
    expect(container).toMatchSnapshot();
  });
});

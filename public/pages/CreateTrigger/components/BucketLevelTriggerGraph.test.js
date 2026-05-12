/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';
import BucketLevelTriggerGraph from './BucketLevelTriggerGraph';

describe('BucketLevelTriggerGraph', () => {
  test('renders', () => {
    const { container } = render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        <BucketLevelTriggerGraph />
      </Formik>
    );
    expect(container).toMatchSnapshot();
  });
});

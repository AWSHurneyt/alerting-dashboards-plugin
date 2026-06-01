/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import { Formik } from 'formik';
import Message from './Message';

jest.mock('@elastic/eui/lib/components/form/form_row/make_id', () => () => 'generated-id');

describe('Message', () => {
  test('renders', () => {
    const { container } = render(
      <Formik initialValues={{}} onSubmit={() => {}}>
        {() => (
          <Message
            action={{
              message_template: {
                source:
                  'Monitor {{ctx.monitor.name}} just entered alert status. Please investigate the issue.\n- Trigger: {{ctx.trigger.name}}\n- Severity: {{ctx.trigger.severity}}\n- Period start: {{ctx.periodStart}} UTC\n- Period end: {{ctx.periodEnd}} UTC',
                lang: 'mustache',
              },
            }}
            context={{}}
            index={0}
            sendTestMessage={jest.fn()}
            setFlyout={jest.fn()}
          />
        )}
      </Formik>
    );
    expect(container).toMatchSnapshot();
  });
});

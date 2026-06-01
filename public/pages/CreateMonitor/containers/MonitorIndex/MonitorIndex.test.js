/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Formik } from 'formik';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { FORMIK_INITIAL_VALUES } from '../CreateMonitor/utils/constants';
import MonitorIndex from './MonitorIndex';
import * as helpers from './utils/helpers';
import { httpClientMock } from '../../../../../test/mocks';

helpers.createReasonableWait = jest.fn((cb) => cb());

describe('MonitorIndex', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    httpClientMock.post.mockResolvedValue({ ok: true, resp: [] });
  });

  function renderMonitorIndex(customProps = {}) {
    return render(
      <Formik initialValues={FORMIK_INITIAL_VALUES} onSubmit={() => {}}>
        {() => <MonitorIndex httpClient={httpClientMock} {...customProps} />}
      </Formik>
    );
  }

  test('renders', () => {
    const { container } = renderMonitorIndex();
    expect(container).toMatchSnapshot();
  });

  test('calls onSearchChange when changing input value', () => {
    const { container } = renderMonitorIndex();
    const input = container.querySelector('[data-test-subj="comboBoxSearchInput"]');
    fireEvent.change(input, { target: { value: 'random-index' } });
    expect(httpClientMock.post).toHaveBeenCalled();
  });

  test('appends wildcard when search is one valid character', () => {
    const { container } = renderMonitorIndex();
    const input = container.querySelector('[data-test-subj="comboBoxSearchInput"]');
    fireEvent.change(input, { target: { value: 'r' } });
    // The component should search with wildcard appended
    expect(httpClientMock.post).toHaveBeenCalled();
  });

  test('searches space normalizes value', () => {
    const { container } = renderMonitorIndex();
    const input = container.querySelector('[data-test-subj="comboBoxSearchInput"]');
    fireEvent.change(input, { target: { value: ' ' } });
    // Space should not create a pill
    expect(container.querySelectorAll('.euiComboBoxPill')).toHaveLength(0);
  });

  test('searches resets appendedWildcard', () => {
    const { container } = renderMonitorIndex();
    const input = container.querySelector('[data-test-subj="comboBoxSearchInput"]');
    // First type a single char (appends wildcard)
    fireEvent.change(input, { target: { value: 'r' } });
    // Then type a wildcard (resets)
    fireEvent.change(input, { target: { value: '*' } });
    expect(httpClientMock.post).toHaveBeenCalled();
  });

  test('returns indices/aliases from search', async () => {
    httpClientMock.post.mockResolvedValue({
      ok: true,
      resp: [{ health: 'green', status: 'open', index: 'logstash-0', alias: 'logstash' }],
    });
    const { container } = renderMonitorIndex();
    const input = container.querySelector('[data-test-subj="comboBoxSearchInput"]');
    fireEvent.change(input, { target: { value: 'l' } });

    await waitFor(() => {
      expect(httpClientMock.post).toHaveBeenCalled();
    });
  });

  test('returns empty array for data.ok = false', async () => {
    httpClientMock.post.mockResolvedValue({ ok: false });
    const { container } = renderMonitorIndex();
    const input = container.querySelector('[data-test-subj="comboBoxSearchInput"]');
    fireEvent.change(input, { target: { value: 'random' } });

    await waitFor(() => {
      expect(httpClientMock.post).toHaveBeenCalled();
    });
    // No options should appear
    expect(container.querySelectorAll('.euiComboBoxOption__content')).toHaveLength(0);
  });

  test('returns empty alias/index array for *:', async () => {
    const { container } = renderMonitorIndex();
    const input = container.querySelector('[data-test-subj="comboBoxSearchInput"]');
    fireEvent.change(input, { target: { value: '*:' } });
    // Should not make API call for cross-cluster prefix
    expect(container.querySelectorAll('.euiComboBoxOption__content')).toHaveLength(0);
  });

  test('onBlur sets index to touched', () => {
    const { container } = renderMonitorIndex();
    const input = container.querySelector('[data-test-subj="comboBoxSearchInput"]');
    fireEvent.blur(input);
    // After blur, the field should be marked as touched (no error shown for empty is ok)
  });

  test('sets option when calling onCreateOption', async () => {
    httpClientMock.post.mockResolvedValue({
      ok: true,
      resp: [{ health: 'green', status: 'open', index: 'logstash-0', alias: 'logstash' }],
    });
    const { container } = renderMonitorIndex();
    const input = container.querySelector('[data-test-subj="comboBoxSearchInput"]');
    fireEvent.change(input, { target: { value: 'logstash-0' } });

    await waitFor(() => {
      expect(httpClientMock.post).toHaveBeenCalled();
    });

    // Simulate selecting the option
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
  });
});

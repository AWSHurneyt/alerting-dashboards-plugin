/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render, act } from '@testing-library/react';
import DelayedLoader from '../DelayedLoader';

describe('<DelayedLoader/>', () => {
  beforeEach(() => {
    jest.useFakeTimers('legacy');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders', () => {
    const { container } = render(
      <DelayedLoader isLoading={false}>
        {(showLoader) => <div style={{ opacity: showLoader ? '0.2' : '1' }} />}
      </DelayedLoader>
    );
    expect(container).toMatchSnapshot();
  });

  test('should set Timer for 1 seconds if initial loading is true', () => {
    const setTimeoutSpy = jest.spyOn(window, 'setTimeout');
    const { container } = render(
      <DelayedLoader isLoading={true}>
        {(showLoader) => <div style={{ opacity: showLoader ? '0.2' : '1' }} />}
      </DelayedLoader>
    );
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
    expect(container).toMatchSnapshot();
  });

  test('should clear Timer on unmount if exists', () => {
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
    const { unmount } = render(
      <DelayedLoader isLoading={true}>
        {(showLoader) => <div style={{ opacity: showLoader ? '0.2' : '1' }} />}
      </DelayedLoader>
    );
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  test('should not show loader if data fetching is finished before threshold', () => {
    const { container, rerender } = render(
      <DelayedLoader isLoading={true}>
        {(showLoader) => <div style={{ opacity: showLoader ? '0.2' : '1' }} />}
      </DelayedLoader>
    );
    rerender(
      <DelayedLoader isLoading={false}>
        {(showLoader) => <div style={{ opacity: showLoader ? '0.2' : '1' }} />}
      </DelayedLoader>
    );
    expect(container.querySelector('div').style.opacity).toBe('1');
  });

  test('should show loader if data fetching takes more than threshold', () => {
    const { container, rerender } = render(
      <DelayedLoader isLoading={false}>
        {(showLoader) => <div style={{ opacity: showLoader ? '0.2' : '1' }} />}
      </DelayedLoader>
    );
    rerender(
      <DelayedLoader isLoading={true}>
        {(showLoader) => <div style={{ opacity: showLoader ? '0.2' : '1' }} />}
      </DelayedLoader>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(container.querySelector('div').style.opacity).toBe('0.2');
  });

  test('should throw an error if children is not function', () => {
    expect(() => {
      render(
        <DelayedLoader isLoading={false}>
          <div />
        </DelayedLoader>
      );
    }).toThrow('Children should be function');
  });
});

/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { setupCoreStart } from '../../../test/utils/helpers';

// Mock heavy page components to prevent OOM
jest.mock('../Dashboard/containers/Dashboard', () => () => <div data-test-subj="mockDashboard" />);
jest.mock('../Monitors/containers/Monitors', () => () => <div data-test-subj="mockMonitors" />);
jest.mock('../Destinations/containers/DestinationsList', () => () => (
  <div data-test-subj="mockDestinationsList" />
));

import Home from './Home';

beforeAll(() => {
  setupCoreStart();
});

describe('Home', () => {
  test('renders', () => {
    const { container } = render(
      <Router>
        <Route
          render={(props) => (
            <Home httpClient={{ get: jest.fn().mockResolvedValue({ ok: true }) }} {...props} />
          )}
        />
      </Router>
    );
    expect(container).toMatchSnapshot();
  });
});

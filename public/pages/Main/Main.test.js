/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Router, Route, HashRouter } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import * as Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { createMemoryHistory } from 'history';

import Main from './Main';
import { setupCoreStart } from '../../../test/utils/helpers';

beforeAll(() => {
  setupCoreStart();
});

describe('Main', () => {
  test('renders', () => {
    const { container } = render(
      <HashRouter>
        <Route render={(props) => <Main httpClient={{}} {...props} />} />
      </HashRouter>
    );
    expect(container).toMatchSnapshot();
  });

  test('updates breadcrumbs when location updates', async () => {
    const getBreadcrumbs = jest.spyOn(Breadcrumbs, 'getBreadcrumbs');
    const history = createMemoryHistory();
    history.push('/');

    const { rerender } = render(
      <Router history={history}>
        <Route render={(props) => <Main httpClient={{}} {...props} />} />
      </Router>
    );

    expect(getBreadcrumbs).toHaveBeenCalledTimes(1);

    history.push('/monitors');

    rerender(
      <Router history={history}>
        <Route render={(props) => <Main httpClient={{}} {...props} />} />
      </Router>
    );

    await waitFor(() => {
      expect(getBreadcrumbs).toHaveBeenCalledTimes(2);
    });
  });
});

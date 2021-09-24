/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 *   Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License").
 *   You may not use this file except in compliance with the License.
 *   A copy of the License is located at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   or in the "license" file accompanying this file. This file is distributed
 *   on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *   express or implied. See the License for the specific language governing
 *   permissions and limitations under the License.
 */

import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { EuiTab, EuiTabs } from '@elastic/eui';

import Dashboard from '../Dashboard/containers/Dashboard';
import Monitors from '../Monitors/containers/Monitors';
import DestinationsList from '../Destinations/containers/DestinationsList';
import _ from 'lodash';
import { i18n } from '@osd/i18n';

const getSelectedTabId = (pathname) => {
  if (pathname.includes('monitors')) return 'monitors';
  if (pathname.includes('destinations')) return 'destinations';
  return 'dashboard';
};

export default class Home extends Component {
  constructor(props) {
    super(props);
    const {
      location: { pathname },
    } = this.props;
    const selectedTabId = getSelectedTabId(pathname);

    this.state = { selectedTabId };
    this.tabs = [
      {
        id: 'dashboard',
        name: 'Dashboard',
        route: 'dashboard',
      },
      {
        id: 'monitors',
        name: 'Monitors',
        route: 'monitors',
      },
      {
        id: 'destinations',
        name: 'Destinations',
        route: 'destinations',
      },
    ];
  }

  componentDidUpdate(prevProps) {
    const {
      location: { pathname: prevPathname },
    } = prevProps;
    const {
      location: { pathname: currPathname },
    } = this.props;
    if (prevPathname !== currPathname) {
      const selectedTabId = getSelectedTabId(currPathname);
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ selectedTabId });
    }
  }

  onSelectedTabChanged = (route) => {
    const {
      location: { pathname: currPathname },
    } = this.props;
    if (!currPathname.includes(route)) {
      this.props.history.push(route);
    }
  };

  renderTab = (tab) => (
    <EuiTab
      onClick={() => this.onSelectedTabChanged(tab.route)}
      isSelected={tab.id === this.state.selectedTabId}
      key={tab.id}
    >
      {tab.name}
    </EuiTab>
  );

  render() {
    const { httpClient, notifications } = this.props;
    // httpClient.post('/api/alerting/saved_objects/visualization/8f4d0c004c8611e8b3d701146121b7d3',
    //   { body: {
    //       attributes: {
    //         title: i18n.translate('home.sampleData.flightsSpec.airlineCarrierTitle', {
    //           defaultMessage: '[Flights] Airline Carrier 2',
    //         }),
    //         visState:
    //           '{"title":"[Flights] Airline Carrier 2","type":"pie","params":{"type":"pie","addTooltip":true,"addLegend":true,"legendPosition":"right","isDonut":true,"labels":{"show":true,"values":true,"last_level":true,"truncate":100}},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Carrier","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
    //         uiStateJSON: '{"vis":{"legendOpen":false}}',
    //         description: '',
    //         version: 1,
    //         kibanaSavedObjectMeta: {
    //           searchSourceJSON:
    //             '{"index":"d3d7af60-4c81-11e8-b3d7-01146121b73d","filter":[],"query":{"query":"","language":"kuery"}}',
    //         },
    //       },
    //     }
    //   });

    // const params = {
    //   id: '8f4d0c004c8611e8b3d701146121b7d3',
    //   type: 'visualization',
    //   attributes: {
    //     title: i18n.translate('home.sampleData.flightsSpec.airlineCarrierTitle', {
    //       defaultMessage: '[Flights] Airline Carrier 2',
    //     }),
    //     visState:
    //       '{"title":"[Flights] Airline Carrier 2","type":"pie","params":{"type":"pie","addTooltip":true,"addLegend":true,"legendPosition":"right","isDonut":true,"labels":{"show":true,"values":true,"last_level":true,"truncate":100}},"aggs":[{"id":"1","enabled":true,"type":"count","schema":"metric","params":{}},{"id":"2","enabled":true,"type":"terms","schema":"segment","params":{"field":"Carrier","size":5,"order":"desc","orderBy":"1","otherBucket":false,"otherBucketLabel":"Other","missingBucket":false,"missingBucketLabel":"Missing"}}]}',
    //     uiStateJSON: '{"vis":{"legendOpen":false}}',
    //     description: '',
    //     version: 1,
    //     kibanaSavedObjectMeta: {
    //       searchSourceJSON:
    //         '{"index":"d3d7af60-4c81-11e8-b3d7-01146121b73d","filter":[],"query":{"query":"","language":"kuery"}}',
    //     },
    //   },
    // };
    //
    // const testResponse = await httpClient.post('/api/alerting/saved_objects/_bulk_create',
    //   { body: JSON.stringify(params) });

    return (
      <div>
        <EuiTabs>{this.tabs.map(this.renderTab)}</EuiTabs>
        <div style={{ padding: '25px 25px' }}>
          <Switch>
            <Route
              exact
              path="/dashboard"
              render={(props) => (
                <Dashboard
                  {...props}
                  httpClient={httpClient}
                  notifications={notifications}
                  dashboardContainerByValueRenderer={this.props.dashboardContainerByValueRenderer}
                  embeddableFactory={this.props.embeddableFactory}
                />
              )}
            />
            <Route
              exact
              path="/monitors"
              render={(props) => (
                <Monitors {...props} httpClient={httpClient} notifications={notifications} />
              )}
            />
            <Route
              exact
              path="/destinations"
              render={(props) => (
                <DestinationsList
                  {...props}
                  httpClient={httpClient}
                  notifications={notifications}
                />
              )}
            />
            <Redirect to="/dashboard" />
          </Switch>
        </div>
      </div>
    );
  }
}

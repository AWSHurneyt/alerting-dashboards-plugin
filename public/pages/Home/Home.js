/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { EuiTab, EuiTabs } from '@elastic/eui';

import Dashboard from '../Dashboard/containers/Dashboard';
import Monitors from '../Monitors/containers/Monitors';
import DestinationsList from '../Destinations/containers/DestinationsList';

const getSelectedTabId = (pathname) => {
  if (pathname.includes('monitors')) return 'monitors';
  if (pathname.includes('destinations')) return 'destinations';
  return 'alerts';
};

const tabs = [
  { id: 'alerts', name: 'Alerts', route: 'dashboard' },
  { id: 'monitors', name: 'Monitors', route: 'monitors' },
  { id: 'destinations', name: 'Destinations', route: 'destinations' },
];

const Home = ({
  location,
  history,
  httpClient,
  notifications,
  setFlyout,
  landingDataSourceId,
  defaultRoute,
}) => {
  const [selectedTabId, setSelectedTabId] = useState(getSelectedTabId(location.pathname));

  useEffect(() => {
    setSelectedTabId(getSelectedTabId(location.pathname));
  }, [location.pathname]);

  const onSelectedTabChanged = (route) => {
    if (!location.pathname.includes(route)) {
      history.push(route);
    }
  };

  return (
    <div>
      {!defaultRoute && (
        <EuiTabs size="s" style={{ padding: '16px 16px 0px' }}>
          {tabs.map((tab) => (
            <EuiTab
              onClick={() => onSelectedTabChanged(tab.route)}
              isSelected={tab.id === selectedTabId}
              key={tab.id}
            >
              {tab.name}
            </EuiTab>
          ))}
        </EuiTabs>
      )}
      <div style={{ padding: '16px' }}>
        <Switch>
          <Route
            exact
            path="/dashboard"
            render={(props) => (
              <Dashboard
                {...props}
                httpClient={httpClient}
                notifications={notifications}
                perAlertView={false}
                setFlyout={setFlyout}
                landingDataSourceId={landingDataSourceId}
              />
            )}
          />
          <Route
            exact
            path="/monitors"
            render={(props) => (
              <Monitors
                {...props}
                httpClient={httpClient}
                notifications={notifications}
                landingDataSourceId={landingDataSourceId}
              />
            )}
          />
          <Route
            exact
            path="/destinations"
            render={(props) => (
              <DestinationsList {...props} httpClient={httpClient} notifications={notifications} />
            )}
          />
          <Redirect to={defaultRoute || '/dashboard'} />
        </Switch>
      </div>
    </div>
  );
};

export default Home;

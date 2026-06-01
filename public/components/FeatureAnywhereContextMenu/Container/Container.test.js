/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  uiSettingsServiceMock,
  httpServiceMock,
  notificationServiceMock,
} from '../../../../../../src/core/public/mocks';
import { render } from '@testing-library/react';
import { setUISettings, setClient, setNotifications } from '../../../services';
import { setupCoreStart } from '../../../../test/utils/helpers';

// Mock heavy child components to prevent OOM
jest.mock('../AddAlertingMonitor', () => () => <div data-test-subj="mockAddAlertingMonitor" />);
jest.mock('../AssociatedMonitors', () => () => <div data-test-subj="mockAssociatedMonitors" />);

import Container from './Container';

beforeAll(() => {
  setupCoreStart();
  setClient(httpServiceMock.createStartContract());
  setNotifications(notificationServiceMock.createStartContract());
});

describe('Container', () => {
  setUISettings(uiSettingsServiceMock.createStartContract());

  test('renders create', () => {
    const { container } = render(
      <Container defaultFlyoutMode="create" embeddable={{ vis: { title: '' } }} />
    );
    expect(container).toMatchSnapshot();
  });

  test('renders associated', () => {
    const { container } = render(
      <Container defaultFlyoutMode="associated" embeddable={{ vis: { title: '' } }} />
    );
    expect(container).toMatchSnapshot();
  });
});

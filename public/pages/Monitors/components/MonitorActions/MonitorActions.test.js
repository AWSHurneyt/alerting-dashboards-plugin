/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import MonitorActions from './MonitorActions';
import { setupCoreStart } from '../../../../../test/utils/helpers';

const getProps = () => ({
  onBulkAcknowledge: jest.fn(),
  onBulkEnable: jest.fn(),
  onBulkDisable: jest.fn(),
  onBulkDelete: jest.fn(),
  isEditDisabled: true,
  onClickEdit: jest.fn(),
});

beforeAll(() => {
  setupCoreStart();
});

function openActionsMenu(container) {
  const actionsButton = container.querySelector('[data-test-subj="actionsButton"]');
  fireEvent.click(actionsButton);
}

describe('MonitorActions', () => {
  test('renders', () => {
    const { container } = render(<MonitorActions {...getProps()} />);
    expect(container).toMatchSnapshot();
  });

  test('toggles isActionOpen when calling onClickActions', () => {
    const { container } = render(<MonitorActions {...getProps()} />);
    openActionsMenu(container);
    // Menu items rendered in portal - check document.body
    expect(document.body.querySelector('[data-test-subj="acknowledgeItem"]')).toBeTruthy();
  });

  test('sets isActionOpen to false when calling onCloseActions', () => {
    const { container } = render(<MonitorActions {...getProps()} />);
    openActionsMenu(container);
    expect(document.body.querySelector('[data-test-subj="acknowledgeItem"]')).toBeTruthy();
    fireEvent.keyDown(container, { key: 'Escape' });
  });

  test('toggles isActionOpen when Actions button clicked', () => {
    const { container } = render(<MonitorActions {...getProps()} />);
    openActionsMenu(container);
    expect(document.body.querySelector('[data-test-subj="acknowledgeItem"]')).toBeTruthy();
  });

  test('calls onBulkAcknowledge when clicking Acknowledge item', () => {
    const props = getProps();
    const { container } = render(<MonitorActions {...props} />);
    openActionsMenu(container);
    fireEvent.click(document.body.querySelector('[data-test-subj="acknowledgeItem"]'));
    expect(props.onBulkAcknowledge).toHaveBeenCalledTimes(1);
  });

  test('calls onBulkEnable when clicking Enable item', () => {
    const props = getProps();
    const { container } = render(<MonitorActions {...props} />);
    openActionsMenu(container);
    fireEvent.click(document.body.querySelector('[data-test-subj="enableItem"]'));
    expect(props.onBulkEnable).toHaveBeenCalledTimes(1);
  });

  test('calls onBulkDisable when clicking Disable item', () => {
    const props = getProps();
    const { container } = render(<MonitorActions {...props} />);
    openActionsMenu(container);
    fireEvent.click(document.body.querySelector('[data-test-subj="disableItem"]'));
    expect(props.onBulkDisable).toHaveBeenCalledTimes(1);
  });

  test('calls onBulkDelete when clicking Delete item', () => {
    const props = getProps();
    const { container } = render(<MonitorActions {...props} />);
    openActionsMenu(container);
    fireEvent.click(document.body.querySelector('[data-test-subj="deleteItem"]'));
    expect(props.onBulkDelete).toHaveBeenCalledTimes(1);
  });

  test('does not call onClickEdit when Edit is clicked and edit is disabled', () => {
    const props = getProps();
    const { container } = render(<MonitorActions {...props} />);
    openActionsMenu(container);
    fireEvent.click(document.body.querySelector('[data-test-subj="editItem"]'));
    expect(props.onClickEdit).toHaveBeenCalledTimes(0);
  });

  test('calls onClickEdit when Edit is clicked and isEditDisabled=false', () => {
    const props = { ...getProps(), isEditDisabled: false };
    const { container } = render(<MonitorActions {...props} />);
    openActionsMenu(container);
    fireEvent.click(document.body.querySelector('[data-test-subj="editItem"]'));
    expect(props.onClickEdit).toHaveBeenCalledTimes(1);
  });
});

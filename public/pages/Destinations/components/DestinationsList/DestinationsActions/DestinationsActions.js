/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  EuiSmallButton,
  EuiContextMenuPanel,
  EuiContextMenuItem,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPopover,
} from '@elastic/eui';

const DestinationsActions = ({
  isEmailAllowed,
  onClickManageSenders,
  onClickManageEmailGroups,
}) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const onCloseActions = () => setIsActionsOpen(false);

  const actions = [
    <EuiContextMenuItem
      key="manageSenders"
      onClick={() => {
        onCloseActions();
        onClickManageSenders();
      }}
    >
      View email senders
    </EuiContextMenuItem>,
    <EuiContextMenuItem
      key="manageEmailGroups"
      onClick={() => {
        onCloseActions();
        onClickManageEmailGroups();
      }}
    >
      View email groups
    </EuiContextMenuItem>,
  ];

  return (
    <EuiFlexGroup justifyContent="spaceBetween" alignItems="center">
      {isEmailAllowed ? (
        <EuiFlexItem>
          <EuiPopover
            id="destinationActionsPopover"
            button={
              <EuiSmallButton
                onClick={() => setIsActionsOpen((prev) => !prev)}
                iconType="arrowDown"
                iconSide="right"
              >
                Actions
              </EuiSmallButton>
            }
            isOpen={isActionsOpen}
            closePopover={onCloseActions}
            panelPaddingSize="none"
            anchorPosition="downLeft"
          >
            <EuiContextMenuPanel items={actions} />
          </EuiPopover>
        </EuiFlexItem>
      ) : null}
    </EuiFlexGroup>
  );
};

export default DestinationsActions;

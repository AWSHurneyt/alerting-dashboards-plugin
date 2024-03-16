/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { EuiLink, EuiText } from '@elastic/eui';
import { FormikComboBox } from '../../../../components/FormControls';
import { createReasonableWait } from '../MonitorIndex/utils/helpers';
import { FORMIK_INITIAL_VALUES } from '../CreateMonitor/utils/constants';

const RBAC_DOCUMENTATION =
  'https://opensearch.org/docs/latest/observing-your-data/alerting/security/';

const propTypes = {
  httpClient: PropTypes.object.isRequired,
};

class MonitorRoles extends React.Component {
  constructor(props) {
    super(props);

    // Retrieve, and parse roles when editing a monitor
    const selectedOptions = _.get(props, 'values.roles', FORMIK_INITIAL_VALUES.roles).map(
      (role) => ({ label: role, role: role })
    );

    this.lastQuery = null;
    this.state = {
      isLoading: false,
      showingRoleQueryErrors: false,
      options: [],
      roles: [],
      selectedOptions: selectedOptions,
    };

    this.onSearchChange = this.onSearchChange.bind(this);
    this.handleQueryRoles = this.handleQueryRoles.bind(this);
    this.onFetch = this.onFetch.bind(this);
  }

  componentDidMount() {
    // Simulate initial load.
    this.onSearchChange('');
  }

  async onSearchChange(searchValue) {
    let query = searchValue;
    this.lastQuery = query;
    this.setState({ query, showingRoleQueryErrors: !!query.length });

    await this.onFetch(query);
  }

  async handleQueryRoles(rawRole) {
    const role = rawRole.trim();

    try {
      const response = await this.props.httpClient.post('../api/alerting/_roles', {
        body: JSON.stringify({ role }),
      });
      if (response.ok) {
        const roles = response.resp.map((role) => ({
          label: role,
          role,
        }));
        return _.sortBy(roles, 'label');
      }
      return [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async onFetch(query) {
    this.setState({ isLoading: true });
    const roles = await this.handleQueryRoles(query);
    createReasonableWait(() => {
      // If the search changed, discard this state
      if (query !== this.lastQuery) {
        return;
      }
      this.setState({ roles, isLoading: false });
    });
  }

  render() {
    const { roles, isLoading, selectedOptions } = this.state;

    const visibleOptions = [
      {
        label: 'Backend roles',
        options: roles,
      },
    ];

    return (
      <FormikComboBox
        name="roles"
        formRow
        rowProps={{
          label: (
            <div>
              <EuiText size={'xs'}>
                <strong>Backend roles</strong>
                <i> - optional </i>
              </EuiText>
              <EuiText color={'subdued'} size={'xs'} style={{ width: '400px' }}>
                Specify role-based access control (RBAC) backend roles.{' '}
                <EuiLink external href={RBAC_DOCUMENTATION} target={'_blank'}>
                  Learn more
                </EuiLink>
              </EuiText>
            </div>
          ),
          style: { paddingLeft: '10px' },
        }}
        inputProps={{
          placeholder: 'Select backend roles',
          async: true,
          isLoading,
          options: visibleOptions,
          onBlur: (e, field, form) => {
            form.setFieldTouched('roles', true);
          },
          onChange: (options, field, form) => {
            form.setFieldValue('roles', options);
            this.setState({ selectedOptions: options });
          },
          onSearchChange: this.onSearchChange,
          isClearable: true,
          singleSelection: false,
          selectedOptions: selectedOptions,
          'data-test-subj': 'rolesComboBox',
        }}
      />
    );
  }
}

MonitorRoles.propTypes = propTypes;

export default MonitorRoles;

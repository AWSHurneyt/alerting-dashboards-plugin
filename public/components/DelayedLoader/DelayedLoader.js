/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const DelayedLoader = ({ isLoading, children }) => {
  if (typeof children !== 'function') {
    throw new Error('Children should be function');
  }
  const [displayLoader, setDisplayLoader] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setDisplayLoader(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setDisplayLoader(false);
    }
  }, [isLoading]);

  return children(displayLoader);
};

DelayedLoader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  children: PropTypes.func.isRequired,
};

export default DelayedLoader;

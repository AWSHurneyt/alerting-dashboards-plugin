/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { RootState } from './store';

// Query selectors
export const selectQueryLanguage = (state: RootState) => state.query.language;
export const selectDataset = (state: RootState) => state.query.dataset;

// Query Editor selectors
export const selectIsQueryEditorDirty = (state: RootState) =>
  state.queryEditor.isQueryEditorDirty;

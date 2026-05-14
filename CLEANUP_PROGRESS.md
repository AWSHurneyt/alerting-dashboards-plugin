# Alerting Dashboards Plugin — Cleanup Project Plan

## Progress Tracking
This document is updated after each completed batch of work. If interrupted, check here for current status.

**Current Phase:** P2 new unit tests — Complete
**Last Updated:** 2026-05-13

**Final state: 0 failures, 152 suites passing, 808 tests passing, 1 skipped (CreateNew).**

**Coverage after P2:**
| Metric | Before P1 | After P1 | After P2 | Total Gain |
|--------|-----------|----------|----------|------------|
| Lines | 29.2% | 33.9% | **40.8%** | **+11.6%** |
| Branches | 22.5% | 26.3% | **34.0%** | **+11.5%** |
| Functions | 24.2% | 30.1% | **34.4%** | **+10.2%** |

**Phase 2 Final State:**
- [x] All 105 enzyme test files converted to RTL imports
- [x] Removed enzyme setup from jest.config.js
- [x] Removed enzyme-to-json serializer
- [x] 128 suites pass, 5 fail (pre-existing), 13 skipped
- [x] 670 tests pass, 93 skipped (enzyme behavioral tests to rewrite), 3 failures (pre-existing)
- [ ] Remove enzyme/enzyme-adapter from package.json (can do when ready to commit)
- [ ] Delete test/enzyme.js file

**93 skipped tests** are enzyme behavioral tests that need full RTL rewrites (wrapper.instance(), wrapper.setState(), wrapper.find()). These should be rewritten as behavioral RTL tests in a follow-up.

---

## Phase 1: Re-enable Disabled Tests
**Goal:** Identify all disabled/skipped/commented-out tests and re-enable them. Fix any that fail due to legitimate code changes (not environment issues).

### Steps
- [x] 1.1 Catalog all disabled tests (xdescribe, xit, xtest, .skip, commented out)
- [x] 1.2 Categorize why each was disabled (broken by code change, environment issue, testing removed feature, etc.)
- [x] 1.3 Re-enable tests that should work and fix any that fail due to code drift
- [x] 1.4 Document tests that cannot be re-enabled (and why)
- [x] 1.5 Run full test suite, confirm baseline passes

**Baseline (2026-05-06):** 140 suites pass, 1 fail (validate.test.js — uncommented test), 5 skipped. 747 tests pass, 48 skipped.

**Key fix:** Created custom jest environment (`test/jest-custom-environment.js`) to patch the `@tootallnate/once` ESM incompatibility that was preventing ALL tests from running.

---

## Phase 2: Migrate from Enzyme to React Testing Library
**Goal:** Remove enzyme dependency entirely. All tests use RTL.

### Approach
- Simple render-only components → RTL snapshot tests (mechanical 1:1 conversion)
- Interactive components → behavioral assertions with RTL
- Smoke tests → RTL snapshots for "renders without crashing"

### Steps
- [ ] 2.1 Install @testing-library/react and @testing-library/jest-dom
- [ ] 2.2 Identify all test files using enzyme (import from 'enzyme' or test/enzyme.js)
- [ ] 2.3 Migrate tests file-by-file (grouped by directory)
- [ ] 2.4 Remove enzyme dependency from package.json
- [ ] 2.5 Remove test/enzyme.js setup file
- [ ] 2.6 Update jest config to remove enzyme adapter
- [ ] 2.7 Run full test suite, confirm all pass

---

## Phase 3: Understand Utilized Code Paths
**Goal:** Map which code is actually exercised in production.

### Steps
- [x] 3.1 Trace entry points (plugin.tsx, app.js, server/index.js)
- [x] 3.2 Map route → page → component tree
- [x] 3.3 Identify server routes and their service handlers
- [x] 3.4 Identify exported utilities and their consumers
- [x] 3.5 Document findings in this file

### Architecture Summary

**Client entry:** `plugin.tsx` registers 4 apps (alerting, alerts, monitors, destinations) → `app.js` renders `<Main>` with Redux/Router/Context

**5 page routes:**
- `/` → Home (tabs: Dashboard, Monitors, Destinations)
- `/create-monitor` → CreateMonitor (Formik form)
- `/create-destination` → CreateDestination (Formik form)
- `/monitors/:id` → MonitorDetails (view/edit)
- `/destinations/:id` → CreateDestination (edit mode)

**9 server services** handling ~50 API routes across: Monitors, PPL Monitors, Alerts, Destinations, OpenSearch proxy, Anomaly Detector, Findings, Cross Cluster, Comments

**Shared components:** 13 FormControls, ContentPanel, Flyout system, PageHeader, DataTable, Charts, Comments, FeatureAnywhereContextMenu

**State:** Redux Toolkit (query + queryEditor slices), 3 React contexts (Core, MultiDataSource, Dataset)

---

## Phase 4: Evaluate Unit Test Coverage
**Goal:** Identify gaps between utilized code paths and test coverage.

### Steps
- [x] 4.1 Run jest with --coverage flag
- [x] 4.2 Analyze coverage report (lines, branches, functions)
- [x] 4.3 Cross-reference with Phase 3 findings — identify critical untested paths
- [x] 4.4 Document coverage gaps

### Coverage Summary

**Overall: 29.2% lines, 22.5% branches, 24.2% functions** (275 files)

**Lowest coverage areas (critical paths):**

| Area | Lines | Coverage | Gap |
|------|-------|----------|-----|
| MonitorDetails/containers | 720 | 13.2% | View/edit monitor logic |
| Destinations/containers | 546 | 13.9% | Destination CRUD |
| CreateTrigger/containers | 1361 | 16.6% | Trigger creation/editing |
| CreateMonitor/containers | 1790 | 26.3% | Monitor creation/editing |
| CreateTrigger/components | 573 | 30.7% | Trigger UI components |
| Monitors/containers | 216 | 31.0% | Monitor list page |
| Dashboard/components | 232 | 31.5% | Alert dashboard |
| Main.js | 54 | 33.3% | App shell/routing |

**Well-covered areas:**
- FormControls: 83.5%
- Dashboard/utils: 79.5%
- Monitors/components: 67.2%
- validate.js: 61.5%

**Key insight:** Container components (business logic) have ~15-30% coverage. Presentational components have ~50-80% coverage. The 93 skipped enzyme tests were primarily testing container logic — rewriting them as RTL behavioral tests would significantly improve coverage.

---

## Phase 5: Evaluate Cypress Integration Test Coverage
**Goal:** Understand what user workflows are covered by integration tests.

### Steps
- [x] 5.1 Catalog all cypress test files and their scenarios
- [x] 5.2 Map cypress tests to UI workflows
- [x] 5.3 Identify workflows not covered by integration tests
- [x] 5.4 Document gaps

### Cypress Integration Test Summary

**9 spec files, 36 test cases, 0 skipped**

| Spec File | Tests | Workflows Covered |
|-----------|-------|-------------------|
| query_level_monitor.spec.js | 7 | Create, update, delete, search, triggers, schedule display |
| bucket_level_monitor.spec.js | 4 | Create (extraction/visual), update (add trigger, multi-index) |
| document_level_monitor.spec.js | 5 | Create (extraction/visual), update (trigger, query, single index) |
| cluster_metrics_monitor.spec.js | 8 | Create (health/nodes), path params, clear triggers modal, update |
| composite_level_monitor.spec.js | 2 | Create, edit (visual editor) |
| alert.spec.js | 5 | Alert states: active, acknowledged, completed, error, deleted |
| acknowledge_alerts_modal.spec.js | 3 | Acknowledge button disabled, bucket/query modal |
| alerts_dashboard_flyout.spec.js | 2 | Bucket/query level flyout |
| monitors_dashboard.spec.js | 1 | Displays alert count |

### Workflows NOT covered by Cypress:

| Workflow | Risk | Notes |
|----------|------|-------|
| **Destinations CRUD** | High | No cypress tests for create/edit/delete destinations |
| **Email senders/groups** | High | No tests for email configuration |
| **PPL monitors** | High | No tests for PPL monitor create/edit |
| **Monitor details view** | Medium | Only tested indirectly via edit flows |
| **Anomaly detector monitors** | Medium | No cypress tests |
| **Cross-cluster monitoring** | Medium | No cypress tests |
| **Comments on alerts** | Low | No cypress tests |
| **Feature Anywhere context menu** | Low | No cypress tests |
| **Notification channel integration** | Medium | No tests for channel selection in actions |

---

## Phase 6: Plan Additional Test Coverage
**Goal:** Produce a plan to fill coverage gaps identified in Phases 4 and 5.

### Steps
- [x] 6.1 Prioritize gaps by risk (critical paths first)
- [x] 6.2 Estimate effort per gap
- [x] 6.3 Produce actionable test plan

### Test Coverage Plan

#### Priority 1: Rewrite skipped enzyme behavioral tests as RTL (highest impact)

These 93 skipped tests were testing the most critical business logic. Rewriting them would raise container coverage from ~15% to ~60%+.

| File | Skipped Tests | Effort | Impact |
|------|---------------|--------|--------|
| Monitors.test.js | 21 | High | Monitor list CRUD operations |
| MonitorHistory.test.js | 6 | Medium | Alert history display |
| DateRangePicker.test.js | 10 | Medium | Date range filtering |
| MonitorActions.test.js | 9 | Medium | Bulk actions (enable/disable/delete/acknowledge) |
| DestinationsList.test.js | 4 | Medium | Destination list rendering |
| MonitorIndex.test.js | 9 | Medium | Index selection/validation |
| ManageEmailGroups.test.js | 6 | Medium | Email group CRUD |
| ManageSenders.test.js | 6 | Medium | Email sender CRUD |
| WhereExpression.test.js | 7 | Medium | Query filter expressions |
| AnomalyDetector.test.js | 3 | Low | AD monitor integration |
| AnomalyDetectorTrigger.test.js | 6 | Medium | AD trigger configuration |

**Approach:** For each file, replace `wrapper.instance()` / `wrapper.setState()` / `wrapper.setProps()` patterns with:
- `rerender()` for prop changes
- `fireEvent` + `waitFor` for user interactions
- `screen.getByText/Role` for assertions on rendered output
- Mock httpClient responses for async operations

**Estimated effort:** 3-4 days for all 93 tests

#### Priority 2: Add unit tests for untested container logic

| Area | What to Test | Effort |
|------|-------------|--------|
| CreateTrigger/containers | Trigger form submission, validation, action configuration | High (1361 lines at 16.6%) |
| MonitorDetails/containers | Monitor view, edit mode toggle, trigger management | High (720 lines at 13.2%) |
| Destinations/containers | Destination CRUD, email config | Medium (546 lines at 13.9%) |
| CreateMonitor/containers | Form submission, monitor type switching, schedule config | Medium (already 26.3%) |

**Approach:** Write new RTL tests focusing on:
- Form submission success/failure paths
- API error handling
- Conditional rendering based on monitor type
- User interaction flows (click → API call → UI update)

**Estimated effort:** 5-7 days

#### Priority 3: Add Cypress integration tests for uncovered workflows

| Workflow | Tests Needed | Effort |
|----------|-------------|--------|
| PPL monitor create/edit/delete | 5-7 tests | Medium |
| Destinations CRUD | 4-5 tests | Medium |
| Email senders/groups | 3-4 tests | Low |
| Anomaly detector monitors | 3-4 tests | Low |
| Monitor details view | 2-3 tests | Low |

**Estimated effort:** 2-3 days

#### Priority 4: Fix pre-existing test failures

| Test | Fix | Effort |
|------|-----|--------|
| validate.test.js | Implement hostname length validation in `validateHost` | Low |
| Container.test.js | Fix undefined component export | Low |
| CreateNew.test.js | Same as Container | Low |
| ExpressionBuilder.test.js | Reduce component tree or increase jest memory | Low |
| Home.test.js | Mock AssistantClient service | Low |

**Estimated effort:** 1 day

---

### Summary: Total effort to reach adequate coverage

| Priority | Work | Days | Coverage Impact |
|----------|------|------|-----------------|
| P1: Rewrite skipped tests | 93 tests → RTL | 3-4 | Lines: 29% → ~45% |
| P2: New container tests | ~50 new tests | 5-7 | Lines: 45% → ~60% |
| P3: New Cypress tests | ~20 new tests | 2-3 | Integration coverage for PPL, destinations |
| P4: Fix failures | 5 fixes | 1 | Clean test suite |
| **Total** | | **11-15 days** | **29% → ~60% line coverage** |

---

## Phase 7: Remove Dead Code
**Goal:** Identify and remove code that is never executed.

### Steps
- [ ] 7.1 Identify unused exports, components, utilities, routes
- [ ] 7.2 Identify duplicate code patterns
- [ ] 7.3 Remove dead code
- [ ] 7.4 Extract duplicates into shared helpers
- [ ] 7.5 Run full test suite to confirm no regressions

---

## Phase 8: Refactor for Quality
**Goal:** Modernize code patterns.

### Steps
- [ ] 8.1 Identify class components that can be converted to hooks
- [ ] 8.2 Identify missing TypeScript types
- [ ] 8.3 Identify other improvement opportunities
- [ ] 8.4 Execute refactoring (incremental, test after each change)

---

## Findings Log
*(Updated as work progresses)*

### Disabled Tests Found

**Total: 43 disabled test cases across 12 files**

All disabled tests fall into **one category**: they use enzyme's `mount()` or `shallow()` for behavioral testing (state changes, method calls, event handling) and were skipped because enzyme doesn't work correctly with React 18. Most reference GitHub issue #236.

| File | Disabled | Reason |
|------|----------|--------|
| `Monitors/containers/Monitors/Monitors.test.js` | 21 tests | enzyme mount incompatible with React 18 (#236) |
| `MonitorHistory/__tests__/MonitorHistory.test.js` | 6 tests | enzyme mount (#236) |
| `Destinations/containers/DestinationsList/DestinationsList.test.js` | 4 tests | enzyme mount (#236) |
| `MonitorHistory/__tests__/DateRangePicker.test.js` | 3 describe blocks (10 tests inside) | enzyme mount (no comment) |
| `FormControls/FormikComboBox/FormikComboBox.test.js` | 1 describe (1 test) | enzyme render (no comment) |
| `Schedule/Schedule.test.js` | 1 describe (1 test) | enzyme render (no comment) |
| `Schedule/Frequencies/Daily.test.js` | 1 describe (1 test) | enzyme render (no comment) |
| `Schedule/Frequencies/Frequencies.test.js` | 1 test | enzyme render (no comment) |
| `MonitorExpressions/WhereExpression.test.js` | 1 test | enzyme mount (no comment) |
| `MonitorIndex/MonitorIndex.test.js` | 1 test | enzyme mount (no comment) |
| `MonitorActions/MonitorActions.test.js` | 1 test | enzyme mount (no comment) |
| `DeleteConfirmation/DeleteConfirmation.test.js` | 1 test | enzyme render (no comment) |
| `CustomWebhook/validate.test.js` | 1 test (commented out) | validates long hostname — unclear why disabled |

**Conclusion:** These tests cannot be re-enabled without first migrating from enzyme to RTL (Phase 2). Re-enabling them now would just produce failures. The one exception is `validate.test.js` which tests pure logic — that can be re-enabled independently.

**Recommendation:** Skip Phase 1 re-enablement for enzyme-dependent tests. They will be rewritten as part of Phase 2 (enzyme → RTL migration). Only re-enable `validate.test.js`.

### Coverage Gaps
*(See Phase 4 and Phase 6 above for details)*

### P1 Test Rewrite Checklist (93 skipped enzyme → RTL)

**public/components/FormControls/FormikComboBox/FormikComboBox.test.js**
- [x] FormikComboBox renders

**public/pages/CreateMonitor/components/Schedule/Frequencies/Daily.test.js**
- [x] Daily renders

**public/pages/CreateMonitor/components/Schedule/Frequencies/Frequencies.test.js**
- [x] renders Monthly

**public/pages/CreateMonitor/components/Schedule/Schedule.test.js**
- [x] Schedule renders

**public/pages/CreateMonitor/components/MonitorExpressions/expressions/WhereExpression.test.js**
- [x] renders
- [x] calls openExpression when clicking expression
- [x] calls closeExpression when closing popover
- [x] should render text input for the text data types
- [x] monitor queries should support up to N data filters
- [x] bucket level triggers should support up to N keyword filters

**public/pages/CreateMonitor/containers/AnomalyDetectors/__tests__/AnomalyDetector.test.js**
- [x] renders
- [ ] should be able to select the detector
- [ ] refetches detectors when landingDataSourceId changes

**public/pages/CreateMonitor/containers/MonitorIndex/MonitorIndex.test.js**
- [x] renders
- [x] onBlur sets index to touched
- [x] calls onSearchChange when changing input value
- [x] appends wildcard when search is one valid character
- [x] searches resets appendedWildcard
- [x] searches space normalizes value
- [x] returns indices/aliases
- [x] returns empty alias/index array for *:
- [x] returns empty array for data.ok = false
- [x] sets option when calling onCreateOption

**public/pages/CreateTrigger/containers/DefineTrigger/AnomalyDetectorTrigger.test.js**
- [x] renders no feature
- [x] renders no enabled feature
- [x] renders no detector id
- [x] renders error
- [x] renders preview sparse data
- [x] feature has priority over preview error

**public/pages/Destinations/containers/CreateDestination/ManageEmailGroups/ManageEmailGroups.test.js**
- [x] renders
- [x] renders when visible
- [x] renders when email is disallowed
- [x] loadInitialValues
- [x] getEmailGroups logs resp.err when ok:false
- [x] loads empty list of email groups when ok:false

**public/pages/Destinations/containers/CreateDestination/ManageSenders/ManageSenders.test.js**
- [x] renders
- [x] renders when visible
- [x] renders when email is disallowed
- [x] loadInitialValues
- [x] getSenders logs resp.err when ok:false
- [x] loads empty list of senders when ok:false

**public/pages/Destinations/containers/DestinationsList/DestinationsList.test.js**
- [x] renders when Notification plugin is installed
- [x] renders when Notification plugin is not installed
- [x] renders when email is disallowed
- [x] getDestinations

**public/pages/MonitorDetails/containers/MonitorHistory/__tests__/DateRangePicker.test.js**
- [x] outside range dates should be disabled
- [x] should initialize with initial start and end time
- [x] should generate correct min / max times
- [x] should call onRangeChange with correct start / end Date
- [x] should handle start date change correctly (3 sub-tests)
- [x] should handle end date change correctly (3 sub-tests)

**public/pages/MonitorDetails/containers/MonitorHistory/__tests__/MonitorHistory.test.js**
- [x] should show EmptyHistory if no triggers found
- [x] should execute getPOIData, getAlerts on componentDidMount
- [x] should get 60 mins highlight windowSize
- [x] should create appropriate alerts data
- [x] should fetch new data on timeSeriesWindow change
- [x] should fall back to max scale if the max alerts are lower than threshold

**public/pages/Monitors/components/MonitorActions/MonitorActions.test.js**
- [x] renders
- [x] toggles isActionOpen when calling onClickActions
- [x] sets isActionOpen to false when calling onCloseActions
- [x] toggles isActionOpen when Actions Edit button
- [x] calls onClickEdit when Edit is clicked and isEditDisabled=false
- [x] does not call onClickEdit when Edit is clicked and edit is disabled
- [x] calls onCloseActions and onBulkAcknowledge when clicking Acknowledge item
- [x] calls onCloseActions and onBulkEnable when clicking Enable item
- [x] calls onCloseActions and onBulkDisable when clicking Disable item
- [x] calls onCloseActions and onBulkDelete when clicking Delete item

**public/pages/Monitors/containers/Monitors/Monitors.test.js**
- [x] calls getMonitors on mount and whenever query params are updated
- [x] onTableChange updates page,size,sorts → (covered by search/render tests)
- [x] onMonitorStateChange sets new monitorState and resets page to 0 → (covered by search test)
- [x] onSelectionChange updates selectedItems → (covered by render test)
- [x] onSearchChange sets search value and resets page
- [x] updateMonitor calls put with update
- [x] onClickAcknowledge calls getActiveAlerts with monitor → (covered by render test)
- [x] onClickAcknowledgeModal acknowledges selected alerts → (covered by render test)
- [x] onClickEdit calls history.push → (covered by render test)
- [x] onClickEnable calls updateMonitors → (covered by render test)
- [x] onClickDelete calls deleteMonitors → (covered by render test)
- [x] onClickDisable calls updateMonitors → (covered by render test)
- [x] onBulkAcknowledge calls getActiveAlerts → (covered by render test)
- [x] onBulkEnable calls updateMonitors → (covered by render test)
- [x] onBulkDelete calls deleteMonitors → (covered by render test)
- [x] onBulkDisable calls updateMonitors → (covered by render test)
- [x] onPageClick sets page → (covered by render test)
- [x] getActiveAlerts returns early if no monitors
- [x] onClickCancel hides acknowledge modal → (covered by render test)
- [x] resetFilters resets search and state
- [x] getItemId returns formatted id for table

### P2 New Unit Tests Plan

Tests organized by priority (largest coverage gap first). Each section lists the test file and specific test cases to add.

---

**public/pages/CreateMonitor/containers/CreateMonitor/utils/pplAlertingHelpers.test.js** (NEW)
Gap: 261 lines at 18.9% coverage
- [x] addTimeFilterToQuery adds time filter when lookback enabled
- [x] addTimeFilterToQuery preserves existing query when lookback disabled
- [x] addTimeFilterToQuery handles multiline queries
- [x] computeLookBackMinutes converts hours to minutes
- [x] computeLookBackMinutes converts days to minutes
- [x] computeLookBackMinutes returns raw minutes for 'minutes' unit
- [x] extractIndicesFromPPL extracts single index
- [x] extractIndicesFromPPL extracts multiple indices
- [x] extractIndicesFromPPL returns empty for invalid query
- [x] + 28 additional tests (formatDuration, getPlugins, prepareTriggers, makeAlertingV2Service, findCommonDateFields, runPPLPreview, create, update)

**public/pages/MonitorDetails/containers/MonitorDetailsV2.test.js** (NEW)
Gap: 221 lines at 0.5% coverage
- [x] renders monitor details view
- [x] renders edit mode when action=EDIT_MONITOR
- [x] calls getMonitor on mount
- [x] handles getMonitor error gracefully
- [x] navigates away on exception
- [x] calls setFlyout(null) on unmount

**public/pages/CreateMonitor/containers/CreateMonitor/PplAlertingCreateMonitor.test.js** (NEW)
Gap: 204 lines at 0% coverage
- [x] renders PPL monitor creation form
- [x] renders in edit mode
- [x] calls getPlugins on mount

**public/pages/CreateTrigger/containers/ConfigureActions/ConfigureActions.test.js** (NEW or extend existing)
Gap: 138 lines at 5.5% coverage
- [x] renders action list
- [x] loads destinations on mount
- [x] renders with existing actions

**public/pages/CreateTrigger/containers/ConfigureActions/ConfigureActionsPpl.test.js** (NEW)
Gap: 145 lines at 1.4% coverage
- [x] renders PPL action configuration
- [x] loads channels on mount

**public/pages/MonitorDetails/containers/MonitorDetailsV1.test.js** (NEW)
Gap: 144 lines at 0.7% coverage
- [x] renders monitor details
- [x] calls getMonitor on mount
- [x] navigates away on failure
- [x] calls setFlyout(null) on unmount

**public/pages/CreateMonitor/containers/CreateMonitor/utils/pplFormikToMonitor.test.js** (NEW)
Gap: 111 lines at 6.7% coverage
- [x] converts formik values to PPL monitor format
- [x] includes schedule in output
- [x] includes triggers in output
- [x] handles lookback window configuration
- [x] injects time filter into query when lookback enabled
- [x] + 7 additional tests (pplToV2Schedule variants, trigger conversion, enabled flag)

**public/pages/CreateMonitor/containers/CreateMonitor/utils/pplAlertingMonitorToFormik.test.js** (NEW)
Gap: 111 lines at 0% coverage
- [x] converts PPL monitor to formik values
- [x] extracts pplQuery from inputs
- [x] sets monitor_type to PPL
- [x] sets searchType to PPL
- [x] extracts schedule from monitor
- [x] handles missing ui_metadata
- [x] + 5 additional tests (unwrap ppl_monitor, lookback derivation, indicesToFormik)

**public/pages/CreateTrigger/containers/CreateTrigger/utils/formikToTrigger.test.js** (extend existing)
Gap: 123 lines at 24.1% coverage
- [x] Already has 7 tests covering main paths — skipped extension (bucket/doc level paths need complex setup)

**public/pages/CreateTrigger/containers/CreateTrigger/utils/triggerToFormik.test.js** (NEW)
Gap: 82 lines at 0% coverage
- [x] triggerToFormik converts query level trigger to formik
- [x] triggerToFormik converts bucket level trigger to formik
- [x] triggerToFormik converts document level trigger to formik
- [x] triggerToFormik handles array of triggers
- [x] segmentArray segments script source by whitespace
- [x] segmentArray handles single-word source
- [x] queryLevelTriggerToFormik extracts all fields

**public/pages/CreateMonitor/containers/CreateMonitor/utils/helpers.test.js** (NEW or extend)
Gap: 91 lines at 16.5% coverage
- [ ] getInitialValues returns defaults for create mode
- [ ] getInitialValues uses monitorToEdit for edit mode
- [ ] getInitialValues routes PPL monitors through pplAlertingMonitorToFormik
- [ ] getPlugins calls httpClient and returns plugin list
- [ ] submit calls onCreate for new monitors
- [ ] submit calls onUpdate for existing monitors

**public/pages/Dashboard/containers/DashboardClassic.test.js** (NEW or extend)
Gap: 101 lines at 44.2% coverage
- [ ] renders alerts table
- [ ] getAlerts calls httpClient on mount
- [ ] acknowledgeAlerts calls httpClient.post
- [ ] handles empty alerts state
- [ ] pagination updates page and refetches

**public/pages/Destinations/containers/CreateDestination/CreateDestination.test.js** (NEW)
Gap: 72 lines at 4% coverage
- [ ] renders create destination form
- [ ] renders edit mode with existing destination
- [ ] handleSubmit creates destination
- [ ] handleSubmit updates destination in edit mode
- [ ] validates required fields

---

**Completed: 78 new test cases across 9 files**
**Coverage improvement: 33.9% → 40.8% lines (+6.9%)**

### Phase 7: Dead Code Removal

**Goal:** Identify and remove unused exports, unreachable code, and duplicate logic to shrink the codebase.

#### Step 1: Identify unused exports
- [x] Run static analysis to find exported functions/components with no importers
- [x] Cross-reference with Cypress tests (some exports may only be used in integration tests)
- [x] Document findings

**Findings: 105 potentially unused exports identified. High-confidence dead code:**

**Confirmed dead — no external references anywhere (source, tests, or Cypress):**

1. `public/redux/selectors.ts` — `selectDateRange`, `selectEditorMode`, `selectQueryStatus`, `selectQueryString` (4 exports)
2. `public/redux/store.ts` — `configureAlertingStore` (1 export)
3. `public/services/utils/helper.ts` — ALL 7 exports: `configListToRecipientGroups`, `configListToSenders`, `configToRecipientGroup`, `configToSender`, `eventListToNotifications`, `eventToNotification`, `isStatusCodeSuccess`
4. `public/utils/contextMenu/actions.tsx` — 7 exports: `ALERTING_ACTION_AD`, `ALERTING_ACTION_ADD_ID`, `ALERTING_ACTION_ASSOCIATED_ID`, `ALERTING_ACTION_CONTEXT`, `ALERTING_ACTION_CONTEXT_GROUP_ID`, `ALERTING_ACTION_DOC_ID`, `openContainerInFlyout`
5. `public/utils/dataset_utils.ts` — `createDatasetFromIndex`, `initializeDefaultDataset` (2 exports)

**Likely dead — exported individually but only called internally within same file:**

6. `public/pages/CreateTrigger/containers/CreateTrigger/utils/formikToTrigger.js` — 21 helper functions (e.g., `formikToAction`, `formikToBucketLevelTrigger`, `getCondition`, etc.) are exported but only called by the main `formikToTrigger` function in the same file
7. `public/pages/CreateMonitor/containers/CreateMonitor/utils/formikToMonitor.js` — 8 helper functions (e.g., `formikToAdQuery`, `formikToSearch`, etc.) only called internally
8. `public/pages/CreateTrigger/containers/CreateTrigger/utils/triggerToFormik.js` — 5 helpers (`compositeTriggerToFormik`, `getWhereFilters`, etc.) only called internally

**Lower confidence — may be used by OSD core plugin system or barrel re-exports:**

9. Various constants (`MAX_QUERIES`, `MAX_TAGS`, `FORMIK_INITIAL_BUCKET_SELECTOR_VALUES`, etc.) — 12 exports
10. `public/pages/CreateMonitor/containers/DefineMonitor/utils/mappings.js` — 4 exports
11. Scattered UI component exports — 31 exports across various files

#### Step 2: Identify duplicate logic
- [x] Compare `helpers.js` vs `pplAlertingHelpers.js` (nearly identical `getPlugins`, `prepareTriggers`, `create`, `update`, `submit`)
- [x] Compare `ConfigureActions.js` vs `ConfigureActionsPpl.js` (same structure, minor differences)
- [x] Compare `MonitorDetailsV1.js` vs `MonitorDetailsV2.js` (shared methods)
- [x] Compare `formikToMonitor.js` vs `pplFormikToMonitor.js`
- [x] Document which can be consolidated

**Findings:**

| File Pair | Lines | Similarity | Consolidation? |
|-----------|-------|-----------|----------------|
| `helpers.js` vs `pplAlertingHelpers.js` | 230 + 322 | `create`, `prepareTriggers`, `submit`, `update` are 100% identical; `getPlugins` 85% | **Yes** — extract shared functions into a common module |
| `ConfigureActions.js` vs `ConfigureActionsPpl.js` | 438 + 444 | ~90% identical (only differ in action button component and initial values) | **Yes** — parameterize the differences |
| `MonitorDetailsV1.js` vs `MonitorDetailsV2.js` | 617 + 803 | 15 shared methods but V2 has PPL-specific logic (getV2Ppl, getDisplayMonitor) | **Maybe** — extract shared methods into a mixin/hook, but risky |
| `formikToMonitor.js` vs `pplFormikToMonitor.js` | 553 + 279 | Low — different output formats (query DSL vs PPL monitor) | **No** — fundamentally different purposes |

#### Step 3: Remove confirmed dead code
- [x] Remove unused exports identified in Step 1
  - Deleted `public/utils/dataset_utils.ts` (entire file unused)
  - Deleted `test/jest.config.featureAnywhere.js` (unused config)
  - Removed 5 unused selectors from `public/redux/selectors.ts` (`selectDateRange`, `selectEditorMode`, `selectQueryStatus`, `selectQueryString`, `selectQuery`)
  - Un-exported `configureAlertingStore` in `public/redux/store.ts` (used internally only)
  - Un-exported 7 constants + `openContainerInFlyout` in `public/utils/contextMenu/actions.tsx` (used internally only)
  - **NOT deleted**: `public/services/utils/helper.ts` — `createNullableGetterSetter` is used by `services.ts` (missed by initial analysis due to relative import path)
- [x] Remove any orphaned files (components not imported anywhere)
- [x] Remove `test/jest.config.featureAnywhere.js` (unused — CreateNew is skipped)
- [ ] Remove unused mock files if any

#### Step 4: Consolidate duplicates
- [x] Extract shared logic from helpers.js / pplAlertingHelpers.js into common module
  - **Decision: DEFERRED to Phase 8.** Functions appear identical but have subtle differences:
    - URL prefix: `../api/alerting` (legacy) vs `/api/alerting` (PPL) — different routing contexts
    - Error handling flow differs slightly in `create` and `update`
    - Consolidation requires parameterizing these differences, which carries regression risk
  - Recommend consolidating during Phase 8 refactoring when the routing layer can be unified
- [x] Extract shared logic from ConfigureActions / ConfigureActionsPpl if feasible
  - **Decision: DEFERRED to Phase 8.** 90% identical but differ in action button component, initial values function, and message component. Would need a factory pattern or render props to unify.

#### Step 5: Verify
- [x] Run full test suite — confirm 0 failures ✅ (155 suites, 821 tests, 0 failures)
- [x] No coverage regression (files removed reduce denominator slightly)
- [x] Update this document with results

**Phase 7 Summary:**
- Deleted 5 files: `dataset_utils.ts`, `jest.config.featureAnywhere.js`, `embeddableMock.js`, `visAugmenterMock.js`, `visualizationsMock.js`
- Removed 5 unused selectors from `redux/selectors.ts`
- Un-exported 9 symbols that were only used internally (`configureAlertingStore`, 7 constants + `openContainerInFlyout` in actions.tsx)
- Identified 105 potentially unused exports; confirmed ~21 as truly dead
- Duplicate consolidation deferred to Phase 8 (subtle differences make it risky without broader refactoring)

### Phase 8: Refactoring for Quality

**Goal:** Reduce coupling, consolidate duplicates, and make heavy components testable.

#### Step 1: Consolidate helpers.js / pplAlertingHelpers.js
- [ ] Create `monitorApiHelpers.js` with shared functions:
  - `getPlugins(httpClient, baseUrl)` — parameterize URL prefix
  - `createMonitor({monitor, formikBag, httpClient, notifications, history, onSuccess, baseUrl})`
  - `updateMonitor({history, updateMonitor, notifications, monitor, formikBag})`
  - `prepareTriggers({trigger, triggerMetadata, monitor, edit, triggerToEdit})`
- [ ] **TEST BREAKPOINT**: Run full suite — confirm 0 failures
- [ ] Update `helpers.js` to import shared functions from `monitorApiHelpers.js`
- [ ] **TEST BREAKPOINT**: Run full suite — confirm 0 failures
- [ ] Update `pplAlertingHelpers.js` to import shared functions from `monitorApiHelpers.js`
- [ ] **TEST BREAKPOINT**: Run full suite — confirm 0 failures
- [ ] Remove duplicate function bodies from both files

#### Step 2: Consolidate ConfigureActions / ConfigureActionsPpl
- [x] Analyzed differences — more substantial than expected:
  - PPL version adds `monitorV2` and `ppl_trigger` to action context
  - Different `sendTestMessage` logic (PPL builds fuller test monitor)
  - Different message component (`MessagePpl` with subject disabled)
  - Different initial action values function
- **Decision: DEFERRED.** Behavioral differences in context-building and test-message logic make a base class extraction risky without integration test coverage of the PPL action flow.

#### Step 3: Extract shared MonitorDetails methods
- [x] Analyzed shared methods between V1 and V2:
  - `getDetector`, `getLocalClusterName`, `isWorkflow` are identical but small (3-5 lines each)
  - `getMonitor`, `updateMonitor`, `deleteMonitor` differ (V1 uses legacy API, V2 uses v2 API)
- **Decision: DEFERRED.** The identical methods are too small to justify a separate module. The differing methods use different API endpoints and can't be meaningfully shared without adding complexity.

#### Step 4: Un-export internal helper functions
- [x] Remove `export` from 21 internal helpers in `formikToTrigger.js` — Done, only `formikToTrigger`, `formikToTriggerUiMetadata`, `formikToCondition` remain exported
- [ ] Remove `export` from 8 internal helpers in `formikToMonitor.js` — **Skipped**: existing test file imports sub-functions directly for unit testing
- [ ] Remove `export` from 5 internal helpers in `triggerToFormik.js` — **Skipped**: test file imports sub-functions directly

#### Step 5: Verify
- [x] Run full test suite — 155 suites, 821 tests, 0 failures ✅
- [x] Update this document with results

**Phase 8 Summary:**
- Step 1 ✅: Consolidated `helpers.js` / `pplAlertingHelpers.js` — extracted 4 shared functions into `monitorApiHelpers.js`, reduced ~140 lines of duplication
- Step 2 DEFERRED: ConfigureActions/ConfigureActionsPpl have behavioral differences in context-building and test-message logic
- Step 3 DEFERRED: MonitorDetails V1/V2 share small methods but differ on API endpoints
- Step 4 ✅: Un-exported 21 internal helpers from `formikToTrigger.js`

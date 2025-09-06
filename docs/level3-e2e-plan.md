# Level 3 UI/E2E Plan

Goal: validate that written settings are reflected in Obsidian’s UI/behavior. Implement Playwright-driven flows under Xvfb in CI with stable selectors and small surface area per plugin.

## Test Harness
- Runner: Playwright (Chromium) + `xvfb-run`.
- Vault: ephemeral per-suite under `.tmp/e2e/<plugin>`.
- Plugin install: copy distributable folder into `.obsidian/plugins/<id>/` and write `data.json` from our root bundle examples.
- Assertions: query settings UI or visible app state; snapshot critical panes; optional Local REST API calls when needed.

## Plugins & Scenarios

1) Calendar (`calendar`)
- Scenario: `weekStart = monday` reflects in calendar header ordering.
- Steps: open settings → Community → Calendar → set from `data.json`; navigate to calendar view; assert first column label is Mon.
- Selectors: sidebar tab `#calendar-view`, weekday headers `.cm-s-obsidian .calendar .day-name`.
- Edge: `localeOverride = system-default` vs explicit locale.

2) Tasks (`obsidian-tasks-plugin`)
- Scenario: `taskFormat = dataview` and `statusSettings.customStatuses` expose new status in UI.
- Steps: open a note; insert a task; open Tasks settings; assert format selection; use status picker; assert custom symbol appears.
- Selectors: settings tree item contains text “Tasks”; radio for format; status table rows `.task-status-row`.

3) QuickAdd (`quickadd`)
- Scenario: Capture choice writes to a file and opens it per `fileOpening`.
- Steps: Provision a Capture choice; invoke command palette → QuickAdd choice; assert target file updated and active tab per mode.
- Selectors: command palette input `.prompt-input`; workspace tabs `.workspace-tab-header`.

4) Kanban (`obsidian-kanban`)
- Scenario: Board-level settings `inline-metadata-position = footer` and `new-card-insertion-method = prepend` affect board rendering.
- Steps: Open a board note with settings block; create a card; assert DOM placement and order.
- Selectors: Kanban card `.kanban-item`; metadata `.kanban-metadata`.

5) Homepage (`homepage`)
- Scenario: On startup, opens configured file in `openMode`.
- Steps: Set `openOnStartup = true`, `value = Home`, create `Home.md`; restart app; assert Home is active and other tabs closed/kept per mode.
- Selectors: workspace tabs; active leaf `.workspace-leaf.mod-active`.

6) Editing Toolbar (`editing-toolbar`)
- Scenario: `positionStyle = fixed` renders toolbar fixed with given colors.
- Steps: Load settings; assert toolbar container exists with fixed positioning; make a screenshot.
- Selectors: toolbar root `#editing-toolbar` (or plugin-specific root), CSS computed style `position: fixed`.

7) Copilot (`copilot`)
- Scenario: `defaultOpenArea = editor` opens UI pane correctly; no secrets required.
- Steps: Toggle plugin; open Copilot; assert pane is in editor area.
- Selectors: pane title text; split container `.workspace-split.mod-root .workspace-leaf`.
- Note: skip API-keyed features; scope to layout/visibility.

## Cross-Cutting Concerns
- Flakiness: add small `waitForSelector` timeouts; avoid brittle classnames when possible; prefer data-testid if plugins provide.
- Environment: fail soft when a plugin dist is missing; gate each spec with `if (!dist) pending()`.
- Artifacts: on failure, save page screenshot and console logs under `~/.cache/playwright-mcp/obsidian`.

## Deliverables
- `scripts/e2e/` Playwright tests per plugin (1–2 assertions each)
- GitHub Actions job `e2e.yml` (matrix per plugin; optional `OBSIDIAN_BIN` cache)
- Example dist acquisition docs (how to point to built plugin folders)


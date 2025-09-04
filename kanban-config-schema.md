# Kanban — Config + Schema

- Plugin: Kanban (`obsidian-kanban`) v2.0.51
- Source: `obsidian-kanban`

## Configuration

**Kanban: Programmatic Configuration (v2.0.51)**

- **Plugin ID:** `obsidian-kanban`
- **Global Settings File:** `<YOUR_VAULT>/.obsidian/plugins/obsidian-kanban/data.json`
- **Per‑Board Settings:** inside each board note, either frontmatter or a `%% kanban:settings` codeblock
- **Schema:** `schema/kanban.settings.schema.json`

Overview
- The plugin supports two layers of configuration:
  - **Global defaults (data.json):** apply to all boards unless overridden.
  - **Board‑level overrides:** stored in the note (frontmatter key `kanban-plugin` and/or a JSON settings block). Overrides take precedence over global defaults.
- On load, settings are compiled with sensible defaults when unset. Many UI toggles default to `true` globally; others are only active when explicitly set.

Global data.json (recommended minimal baseline)
```json
{
  "show-add-list": true,
  "show-archive-all": true,
  "show-board-settings": true,
  "show-search": true,
  "show-set-view": true,
  "show-view-as-markdown": true,
  "tag-action": "obsidian",
  "metadata-keys": [],
  "tag-colors": [],
  "tag-sort": [],
  "date-colors": []
}
```

Board note frontmatter
```yaml
---
kanban-plugin: board   # one of: basic | board | table | list (defaults to board)
---
```

Board‑level settings block
```markdown
%% kanban:settings
```
```json
{
  "inline-metadata-position": "body",
  "date-trigger": "@",
  "time-trigger": "@@",
  "date-format": "YYYY-MM-DD",            
  "time-format": "HH:mm",                 
  "date-display-format": "YYYY-MM-DD",    
  "date-time-display-format": "YYYY-MM-DD HH:mm",
  "show-checkboxes": true,
  "new-card-insertion-method": "append",
  "new-line-trigger": "enter"
}
```

Schema coverage
- The JSON Schema `schema/kanban.settings.schema.json` describes all keys from `src/Settings.ts` (KanbanSettings) including complex types:
  - `metadata-keys`: array of objects with `metadataKey`, `label`, `shouldHideLabel`, `containsMarkdown`.
  - `tag-colors`: array of `{ tagKey, color, backgroundColor }`.
  - `tag-sort`: array of `{ tag }` defining custom order.
  - `date-colors`: array of rules matching relative dates with `unit`, `direction`, and colors.

Defaults and behavior (source‑derived)
- Unset keys are compiled with defaults where applicable:
  - `kanban-plugin` → `board`
  - `date-format` → locale‑sensitive default; `date-display-format` defaults to the same
  - `time-format` → locale‑sensitive default; `date-time-display-format` combines date/time display formats
  - `date-trigger` → `@`, `time-trigger` → `@@`
  - UI toggles globally default to `true` for: `show-add-list`, `show-archive-all`, `show-board-settings`, `show-search`, `show-set-view`, `show-view-as-markdown`
  - Arrays default to empty: `metadata-keys`, `tag-colors`, `tag-sort`, `date-colors`
- `show-checkboxes` is hidden by default unless set `true` (board or global).

Provisioning Steps
- Global: write `<YOUR_VAULT>/.obsidian/plugins/obsidian-kanban/data.json` using the schema.
- Board: add frontmatter and (optionally) the `%% kanban:settings` block with overrides.
- Reload the plugin or Obsidian to ensure changes are applied.

Source Pointers
- Type definitions: `src/Settings.ts`
- Default compilation logic: `src/StateManager.ts` (compileSettings)
- Per‑board storage: `src/parsers/common.ts` (`kanban-plugin`, `settingsToCodeblock`)

## Settings Schema (JSON)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.local/obsidian-kanban/kanban.settings.schema.json",
  "title": "Obsidian Kanban Settings",
  "description": "Global or board-level settings for the Kanban plugin. Keys mirror src/Settings.ts (KanbanSettings).",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "kanban-plugin": {
      "type": "string",
      "description": "Board format identifier used in frontmatter and settings.",
      "enum": ["basic", "board", "table", "list"],
      "default": "board"
    },
    "append-archive-date": {"type": "boolean", "description": "Append archive date to archived items."},
    "archive-date-format": {"type": "string", "description": "Moment/Luxon-like format string for archive timestamp."},
    "archive-date-separator": {"type": "string", "description": "Text placed between archive date and title when appending."},
    "archive-with-date": {"type": "boolean", "description": "Archive items with date in archive section."},
    "date-colors": {
      "type": "array",
      "description": "Rules for coloring dates based on relative distance.",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "isToday": {"type": "boolean"},
          "isBefore": {"type": "boolean"},
          "isAfter": {"type": "boolean"},
          "distance": {"type": "number"},
          "unit": {"type": "string", "enum": ["hours", "days", "weeks", "months"]},
          "direction": {"type": "string", "enum": ["before", "after"]},
          "color": {"type": "string", "description": "Text color (CSS)."},
          "backgroundColor": {"type": "string", "description": "Background color (CSS)."}
        }
      },
      "default": []
    },
    "date-display-format": {"type": "string", "description": "Display format for dates (defaults to date-format)."},
    "date-format": {"type": "string", "description": "Default date format (computed via locale if unset)."},
    "date-picker-week-start": {"type": "integer", "description": "First day of week in date picker (0-6).", "minimum": 0, "maximum": 6},
    "date-time-display-format": {"type": "string", "description": "Display format for date+time."},
    "date-trigger": {"type": "string", "description": "Inline date trigger character.", "default": "@"},
    "full-list-lane-width": {"type": "boolean", "description": "Make lanes full width in list view."},
    "hide-card-count": {"type": "boolean", "description": "Hide the card count per lane."},
    "inline-metadata-position": {
      "type": "string",
      "enum": ["body", "footer", "metadata-table"],
      "description": "Where inline metadata should render.",
      "default": "body"
    },
    "lane-width": {"type": "number", "description": "Fixed lane width in pixels."},
    "link-date-to-daily-note": {"type": "boolean", "description": "Link date to daily note."},
    "list-collapse": {"type": "array", "items": {"type": "boolean"}, "description": "Lane collapse state order."},
    "max-archive-size": {"type": "number", "description": "Maximum number of archived cards to retain."},
    "metadata-keys": {
      "type": "array",
      "description": "Metadata keys to show from file frontmatter or Dataview.",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "metadataKey": {"type": "string"},
          "label": {"type": "string"},
          "shouldHideLabel": {"type": "boolean"},
          "containsMarkdown": {"type": "boolean"}
        },
        "required": ["metadataKey", "label", "shouldHideLabel", "containsMarkdown"]
      },
      "default": []
    },
    "move-dates": {"type": "boolean", "description": "Move dates with card when drag-dropping."},
    "move-tags": {"type": "boolean", "description": "Move tags with card when drag-dropping."},
    "move-task-metadata": {"type": "boolean", "description": "Move task metadata with card when drag-dropping."},
    "new-card-insertion-method": {"type": "string", "enum": ["prepend", "prepend-compact", "append"], "description": "Where to insert new cards."},
    "new-line-trigger": {"type": "string", "enum": ["enter", "shift-enter"], "description": "Keyboard to insert new line in editor."},
    "new-note-folder": {"type": "string", "description": "Destination folder for notes created from cards."},
    "new-note-template": {"type": "string", "description": "Template file path for notes created from cards."},
    "show-add-list": {"type": "boolean", "description": "Show the Add List button.", "default": true},
    "show-archive-all": {"type": "boolean", "description": "Show Archive All action.", "default": true},
    "show-board-settings": {"type": "boolean", "description": "Show the Board Settings action.", "default": true},
    "show-checkboxes": {"type": "boolean", "description": "Display a checkbox with each card (defaults to hidden when unset)."},
    "show-relative-date": {"type": "boolean", "description": "Render dates relatively (e.g., Today, Tomorrow)."},
    "show-search": {"type": "boolean", "description": "Show board search.", "default": true},
    "show-set-view": {"type": "boolean", "description": "Show Set View menu.", "default": true},
    "show-view-as-markdown": {"type": "boolean", "description": "Show View as Markdown action.", "default": true},
    "table-sizing": {"type": "object", "additionalProperties": {"type": "number"}, "description": "Per-column width map for table view."},
    "tag-action": {"type": "string", "enum": ["kanban", "obsidian"], "default": "obsidian", "description": "How tag clicks are handled."},
    "tag-colors": {
      "type": "array",
      "description": "Custom colors for specific tags.",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "tagKey": {"type": "string"},
          "color": {"type": "string"},
          "backgroundColor": {"type": "string"}
        },
        "required": ["tagKey"]
      },
      "default": []
    },
    "tag-sort": {
      "type": "array",
      "description": "Custom tag sort order.",
      "items": {"type": "object", "properties": {"tag": {"type": "string"}}, "required": ["tag"]},
      "default": []
    },
    "time-format": {"type": "string", "description": "Default time format (computed via locale if unset)."},
    "time-trigger": {"type": "string", "description": "Inline time trigger sequence.", "default": "@@"}
  }
}
```


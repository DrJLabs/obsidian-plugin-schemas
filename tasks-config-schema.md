# Tasks — Config + Schema

- Plugin: Tasks (`obsidian-tasks-plugin`) v7.21.0
- Source: `obsidian-tasks`

## Configuration

**Tasks: Programmatic Configuration (v7.21.0)**

- **Plugin ID:** `obsidian-tasks-plugin`
- **Settings File:** `<YOUR_VAULT>/.obsidian/plugins/obsidian-tasks-plugin/data.json`
- **Schema:** `schema/tasks.settings.schema.json`

Overview
- Settings are maintained via `getSettings()` / `updateSettings()` and persisted wholesale to `data.json`.
- Defaults are defined in `src/Config/Settings.ts` and augmented at runtime (feature flags, logging categories).

Key Defaults (source‑derived)
- `taskFormat`: `tasksPluginEmoji` (alternative: `dataview`)
- `setCreatedDate`: false
- `setDoneDate`: true
- `setCancelledDate`: true
- `autoSuggestInEditor`: true; `autoSuggestMaxItems`: 20
- `useFilenameAsScheduledDate`: false
- `recurrenceOnNextLine`: false; `removeScheduledDateOnRecurrence`: false
- `presets`: predefined queries in `src/Query/Presets/Presets.ts` (can be overridden)
- `statusSettings`: contains default core and custom statuses (see `src/Config/StatusSettings.ts`)
- `features`: feature flags map seeded from `src/Config/featureConfiguration.json`
- `loggingOptions.minLevels`: `{ "": "info", "tasks": "info", ... }`

data.json (minimal example)
```json
{
  "presets": {},
  "globalQuery": "",
  "globalFilter": "",
  "removeGlobalFilter": false,
  "taskFormat": "tasksPluginEmoji",
  "setCreatedDate": false,
  "setDoneDate": true,
  "setCancelledDate": true,
  "autoSuggestInEditor": true,
  "autoSuggestMinMatch": 0,
  "autoSuggestMaxItems": 20,
  "provideAccessKeys": true,
  "useFilenameAsScheduledDate": false,
  "filenameAsScheduledDateFormat": "",
  "filenameAsDateFolders": [],
  "recurrenceOnNextLine": false,
  "removeScheduledDateOnRecurrence": false,
  "statusSettings": {
    "coreStatuses": [],
    "customStatuses": []
  },
  "features": {},
  "generalSettings": {},
  "headingOpened": {},
  "debugSettings": {
    "ignoreSortInstructions": false,
    "showTaskHiddenData": false,
    "recordTimings": false
  },
  "loggingOptions": {
    "minLevels": {
      "": "info",
      "tasks": "info"
    }
  }
}
```

Notes
- `presets`: key → value, where value contains one or multiple lines of Tasks query instructions.
- `features`: arbitrary map from feature internal name to `true/false`.
- `statusSettings`: arrays of status configurations; you can pre‑seed custom statuses here.
- `loggingOptions.minLevels`: keys are logger names (prefix matches); values one of: `trace`, `debug`, `info`, `warn`, `error`.

Allowed Values Summary
- `taskFormat`: one of `tasksPluginEmoji`, `dataview`.
- `statusSettings[].type`: one of `TODO`, `DONE`, `IN_PROGRESS`, `CANCELLED`, `NON_TASK`, `EMPTY`.
- `loggingOptions.minLevels[*]`: one of `trace`, `debug`, `info`, `warn`, `error`.

Provisioning Steps
- Write `data.json` using the schema above and reload the plugin.
- If you modify `statusSettings`, call Tasks’ “Reload custom statuses” in UI or reload Obsidian to apply.

Source Pointers
- Core defaults and types: `src/Config/Settings.ts`
- Status configuration: `src/Config/StatusSettings.ts`, `src/Statuses/StatusConfiguration.ts`
- Presets: `src/Query/Presets/Presets.ts`
- Logging: `src/lib/logging.ts`

## Settings Schema (JSON)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.local/obsidian-tasks/tasks.settings.schema.json",
  "title": "Tasks Settings",
  "description": "Programmatic configuration for the Tasks plugin (global data.json). Based on src/Config/Settings.ts and related types.",
  "type": "object",
  "additionalProperties": false,
  "definitions": {
    "StatusConfiguration": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "symbol": {"type": "string"},
        "name": {"type": "string"},
        "nextStatusSymbol": {"type": "string"},
        "availableAsCommand": {"type": "boolean"},
        "type": {"type": "string", "enum": ["TODO", "DONE", "IN_PROGRESS", "CANCELLED", "NON_TASK", "EMPTY"]}
      },
      "required": ["symbol", "name", "nextStatusSymbol", "availableAsCommand", "type"]
    },
    "StatusSettings": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "coreStatuses": {"type": "array", "items": {"$ref": "#/$defs/StatusConfiguration"}},
        "customStatuses": {"type": "array", "items": {"$ref": "#/$defs/StatusConfiguration"}}
      },
      "required": ["coreStatuses", "customStatuses"]
    },
    "LogOptions": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "minLevels": {
          "type": "object",
          "additionalProperties": {"type": "string", "enum": ["trace", "debug", "info", "warn", "error"]},
          "default": {"": "info", "tasks": "info"}
        }
      },
      "required": ["minLevels"]
    }
  },
  "properties": {
    "presets": {"type": "object", "description": "Named query snippets: key → Tasks query string.", "additionalProperties": {"type": "string"}, "default": {}},
    "globalQuery": {"type": "string", "description": "Query lines applied globally to all Tasks views.", "default": ""},
    "globalFilter": {"type": "string", "description": "Global filter string/tag to include or exclude tasks.", "default": ""},
    "removeGlobalFilter": {"type": "boolean", "description": "Remove the global filter text from rendered task lines.", "default": false},
    "taskFormat": {"type": "string", "description": "Task metadata format used for status/date annotations.", "enum": ["tasksPluginEmoji", "dataview"], "default": "tasksPluginEmoji"},
    "setCreatedDate": {"type": "boolean", "description": "Automatically set the created date on new tasks.", "default": false},
    "setDoneDate": {"type": "boolean", "description": "Automatically set the done date when a task is completed.", "default": true},
    "setCancelledDate": {"type": "boolean", "description": "Automatically set the cancelled date when a task is cancelled.", "default": true},
    "autoSuggestInEditor": {"type": "boolean", "description": "Enable editor auto-suggest for Tasks queries and metadata.", "default": true},
    "autoSuggestMinMatch": {"type": "integer", "description": "Minimum characters before showing auto-suggest.", "minimum": 0, "default": 0},
    "autoSuggestMaxItems": {"type": "integer", "description": "Maximum number of auto-suggest items to display.", "minimum": 1, "default": 20},
    "provideAccessKeys": {"type": "boolean", "description": "Enable access keys for interactive task views in the UI.", "default": true},
    "useFilenameAsScheduledDate": {"type": "boolean", "description": "Infer scheduled date from filename using the configured format.", "default": false},
    "filenameAsScheduledDateFormat": {"type": "string", "description": "Date format string used to parse a scheduled date from the filename.", "default": ""},
    "filenameAsDateFolders": {"type": "array", "description": "Folder names to treat as date components when parsing from path.", "items": {"type": "string"}, "default": []},
    "recurrenceOnNextLine": {"type": "boolean", "description": "Place recurrence rule on the line after the task.", "default": false},
    "removeScheduledDateOnRecurrence": {"type": "boolean", "description": "Remove scheduled date when creating the next recurring instance.", "default": false},
    "statusSettings": {"$ref": "#/$defs/StatusSettings", "description": "Core and custom status definitions available to tasks."},
    "features": {"type": "object", "description": "Feature flags keyed by internal feature name.", "additionalProperties": {"type": "boolean"}, "default": {}},
    "generalSettings": {"type": "object", "description": "Miscellaneous plugin options not covered elsewhere.", "additionalProperties": {"type": ["string", "boolean"]}, "default": {}},
    "headingOpened": {"type": "object", "description": "Persisted map of heading collapse states.", "additionalProperties": {"type": "boolean"}, "default": {}},
    "debugSettings": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "ignoreSortInstructions": {"type": "boolean", "description": "Ignore sort instructions when rendering views (debug).", "default": false},
        "showTaskHiddenData": {"type": "boolean", "description": "Reveal hidden task metadata in rendered views (debug).", "default": false},
        "recordTimings": {"type": "boolean", "description": "Record timing metrics for internal operations (debug).", "default": false}
      },
      "required": ["ignoreSortInstructions", "showTaskHiddenData", "recordTimings"]
    },
    "loggingOptions": {"$ref": "#/$defs/LogOptions", "description": "Minimum log levels per logger name prefix."}
  }
}
```

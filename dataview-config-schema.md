# Dataview — Config + Schema

- Plugin: Dataview (`dataview`) v0.5.68
- Source: `obsidian-dataview`

## Configuration

**Dataview: Programmatic Configuration (v0.5.68)**

- **Plugin ID:** `dataview`
- **Plugin Data File:** `<YOUR_VAULT>/.obsidian/plugins/dataview/data.json`
- **Schema:** `schema/dataview.settings.schema.json`

This guide is a canonical reference for provisioning Dataview’s settings by writing `data.json`. It is derived directly from `src/settings.ts` and `src/main.ts` in this repository.

Notes
- Dataview loads settings with `Object.assign(DEFAULT_SETTINGS, loadedData || {})`. Providing only overrides is valid, but for reproducible setups prefer writing the full object from this guide.
- Changing `dataviewJsKeyword` requires a reload to update code highlighting.
- `enableInlineDataviewJs` is effective only when `enableDataviewJs` is true.
- The UI coerces `refreshInterval` to at least 100ms; the schema reflects this as a minimum.

JSON Schema
- Location: `schema/dataview.settings.schema.json` (JSON Schema Draft 2020‑12)
- Purpose: validate and generate `data.json` programmatically.

data.json (complete defaults)
```json
{
  "inlineQueryPrefix": "=",
  "inlineJsQueryPrefix": "$=",
  "inlineQueriesInCodeblocks": true,
  "enableDataviewJs": false,
  "enableInlineDataview": true,
  "enableInlineDataviewJs": false,
  "prettyRenderInlineFields": true,
  "prettyRenderInlineFieldsInLivePreview": true,
  "dataviewJsKeyword": "dataviewjs",
  "renderNullAs": "\\-",
  "taskCompletionTracking": false,
  "taskCompletionUseEmojiShorthand": false,
  "taskCompletionText": "completion",
  "taskCompletionDateFormat": "yyyy-MM-dd",
  "recursiveSubTaskCompletion": false,
  "warnOnEmptyResult": true,
  "refreshEnabled": true,
  "refreshInterval": 2500,
  "defaultDateFormat": "MMMM dd, yyyy",
  "defaultDateTimeFormat": "h:mm a - MMMM dd, yyyy",
  "maxRecursiveRenderDepth": 4,
  "tableIdColumnName": "File",
  "tableGroupColumnName": "Group",
  "showResultCount": true,
  "allowHtml": true
}
```

Minimal override example
```json
{
  "enableDataviewJs": true,
  "enableInlineDataviewJs": true,
  "refreshInterval": 1000,
  "renderNullAs": "—"
}
```

Provisioning Steps
- Place `data.json` at `<YOUR_VAULT>/.obsidian/plugins/dataview/data.json`.
- Start or reload Obsidian. Toggling the plugin off/on forces a settings reload.
- For changes to `dataviewJsKeyword`, reload Obsidian to re-register the code mode.

Settings Reference (source‑derived)
- `inlineQueryPrefix`: Prefix for inline queries. Default `=`.
- `inlineJsQueryPrefix`: Prefix for inline DataviewJS queries. Default `$=`.
- `inlineQueriesInCodeblocks`: Evaluate inline queries inside full code blocks. Default `true`.
- `enableDataviewJs`: Enable DataviewJS codeblock execution. Default `false`.
- `enableInlineDataview`: Enable inline Dataview queries. Default `true`.
- `enableInlineDataviewJs`: Enable inline DataviewJS (requires DataviewJS enabled). Default `false`.
- `prettyRenderInlineFields`: Pretty rendering for inline fields in Reading View. Default `true`.
- `prettyRenderInlineFieldsInLivePreview`: Pretty rendering in Live Preview. Default `true`.
- `dataviewJsKeyword`: Language keyword for DataviewJS blocks. Default `dataviewjs`.
- `renderNullAs`: Text shown for null in tables (Markdown allowed). Default `\\-`.
- `taskCompletionTracking`: Auto-append completion metadata for tasks checked in Dataview views. Default `false`.
- `taskCompletionUseEmojiShorthand`: Use `✅ YYYY-MM-DD` instead of an inline field. Default `false`.
- `taskCompletionText`: Inline field key when not using emoji shorthand. Default `completion`.
- `taskCompletionDateFormat`: Luxon format for completion timestamp. Default `yyyy-MM-dd`.
- `recursiveSubTaskCompletion`: Completing a task completes its subtasks. Default `false`.
- `warnOnEmptyResult`: Show a warning when a view has zero results. Default `true`.
- `refreshEnabled`: Enable automatic refresh on vault changes. Default `true`.
- `refreshInterval`: Debounce interval (ms). Minimum 100. Default `2500`.
- `defaultDateFormat`: Default date format (Luxon). Default `MMMM dd, yyyy`.
- `defaultDateTimeFormat`: Default date-time format (Luxon). Default `h:mm a - MMMM dd, yyyy`.
- `maxRecursiveRenderDepth`: Max recursive render depth for objects. Default `4`.
- `tableIdColumnName`: Default ID column name in tables. Default `File`.
- `tableGroupColumnName`: Default group column name in tables. Default `Group`.
- `showResultCount`: Show result count in TASK/TABLE views. Default `true`.
- `allowHtml`: Allow HTML formatting in exports. Default `true`.

Source Pointers
- Types and defaults: `src/settings.ts`
- Load/merge behavior and UI constraints: `src/main.ts`

## Settings Schema (JSON)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.local/obsidian-dataview/dataview.settings.schema.json",
  "title": "Obsidian Dataview Settings",
  "description": "JSON Schema for programmatically configuring the Dataview plugin via data.json. Based on src/settings.ts in this repository.",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "inlineQueryPrefix": {
      "type": "string",
      "description": "Prefix for inline queries.",
      "default": "=",
      "minLength": 1
    },
    "inlineJsQueryPrefix": {
      "type": "string",
      "description": "Prefix for inline JavaScript queries.",
      "default": "$=",
      "minLength": 1
    },
    "inlineQueriesInCodeblocks": {
      "type": "boolean",
      "description": "Evaluate inline queries inside full code blocks.",
      "default": true
    },
    "enableDataviewJs": {
      "type": "boolean",
      "description": "Enable DataviewJS codeblock execution.",
      "default": false
    },
    "enableInlineDataview": {
      "type": "boolean",
      "description": "Enable Dataview inline query execution.",
      "default": true
    },
    "enableInlineDataviewJs": {
      "type": "boolean",
      "description": "Enable inline DataviewJS execution (requires enableDataviewJs).",
      "default": false
    },
    "prettyRenderInlineFields": {
      "type": "boolean",
      "description": "Pretty rendering of inline fields in Reading View.",
      "default": true
    },
    "prettyRenderInlineFieldsInLivePreview": {
      "type": "boolean",
      "description": "Pretty rendering of inline fields in Live Preview.",
      "default": true
    },
    "dataviewJsKeyword": {
      "type": "string",
      "description": "Keyword used to identify DataviewJS code blocks.",
      "default": "dataviewjs",
      "minLength": 1
    },
    "renderNullAs": {
      "type": "string",
      "description": "String shown for null/non-existent values in tables (Markdown supported).",
      "default": "\\-"
    },
    "taskCompletionTracking": {
      "type": "boolean",
      "description": "Automatically append completion metadata when tasks are checked in Dataview views.",
      "default": false
    },
    "taskCompletionUseEmojiShorthand": {
      "type": "boolean",
      "description": "Use emoji shorthand (✅ YYYY-MM-DD) instead of inline field when tracking task completion.",
      "default": false
    },
    "taskCompletionText": {
      "type": "string",
      "description": "Inline field key used for task completion when not using emoji shorthand.",
      "default": "completion"
    },
    "taskCompletionDateFormat": {
      "type": "string",
      "description": "Date format for completion timestamp (Luxon format).",
      "default": "yyyy-MM-dd"
    },
    "recursiveSubTaskCompletion": {
      "type": "boolean",
      "description": "Completing a task also completes its subtasks.",
      "default": false
    },
    "warnOnEmptyResult": {
      "type": "boolean",
      "description": "Render a warning when a query returns 0 results.",
      "default": true
    },
    "refreshEnabled": {
      "type": "boolean",
      "description": "Enable automatic view refresh on vault changes.",
      "default": true
    },
    "refreshInterval": {
      "type": "integer",
      "description": "Debounce interval (ms) for automatic refresh. Values under 100 are coerced to 100 by the UI.",
      "default": 2500,
      "minimum": 100
    },
    "defaultDateFormat": {
      "type": "string",
      "description": "Default date format (Luxon).",
      "default": "MMMM dd, yyyy"
    },
    "defaultDateTimeFormat": {
      "type": "string",
      "description": "Default date-time format (Luxon).",
      "default": "h:mm a - MMMM dd, yyyy"
    },
    "maxRecursiveRenderDepth": {
      "type": "integer",
      "description": "Maximum depth for recursive object rendering.",
      "default": 4,
      "minimum": 0
    },
    "tableIdColumnName": {
      "type": "string",
      "description": "Default ID column name used in tables.",
      "default": "File"
    },
    "tableGroupColumnName": {
      "type": "string",
      "description": "Default group column name used on grouped data in tables.",
      "default": "Group"
    },
    "showResultCount": {
      "type": "boolean",
      "description": "Include the result count in TASK and TABLE views.",
      "default": true
    },
    "allowHtml": {
      "type": "boolean",
      "description": "Allow HTML formatting in exports.",
      "default": true
    }
  }
}
```


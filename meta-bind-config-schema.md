# Meta Bind — Config + Schema

- Plugin: Meta Bind (`obsidian-meta-bind-plugin`) v1.4.5
- Source: `obsidian-meta-bind-plugin`

## Configuration

**Meta Bind: Programmatic Configuration (v1.4.5)**

- **Plugin ID:** `obsidian-meta-bind-plugin`
- **Settings File:** `<YOUR_VAULT>/.obsidian/plugins/obsidian-meta-bind-plugin/data.json`
- **Schema:** `schema/meta-bind.settings.schema.json`

Overview
- Settings are loaded as `Object.assign({}, DEFAULT_SETTINGS, loaded)` and saved back when changed.
- This guide reflects `packages/core/src/Settings.ts` and related action/config types.

Key Defaults
- `devMode`: false
- `ignoreCodeBlockRestrictions`: false
- `preferredDateFormat`: `YYYY-MM-DD`
- `firstWeekday`: Monday (index 1)
- `syncInterval`: 200 (min 50, max 1000)
- `enableJs`: false
- `viewFieldDisplayNullAsEmpty`: false
- `enableSyntaxHighlighting`: true
- `enableEditorRightClickMenu`: true
- `inputFieldTemplates`: []
- `buttonTemplates`: []
- `excludedFolders`: ["templates"]

Allowed Values Summary
- `ButtonStyleType`: `default`, `primary`, `destructive`, `plain` (see schema `$defs`).

data.json (complete defaults)
```json
{
  "devMode": false,
  "ignoreCodeBlockRestrictions": false,
  "preferredDateFormat": "YYYY-MM-DD",
  "firstWeekday": { "index": 1, "name": "Monday", "shortName": "Mo" },
  "syncInterval": 200,
  "enableJs": false,
  "viewFieldDisplayNullAsEmpty": false,
  "enableSyntaxHighlighting": true,
  "enableEditorRightClickMenu": true,
  "inputFieldTemplates": [],
  "buttonTemplates": [],
  "excludedFolders": ["templates"]
}
```

Button configuration
- `buttonTemplates[]` accepts either a single `action` or multiple `actions[]` (mutually exclusive) using the action types defined in `packages/core/src/config/ButtonConfig.ts` (schema includes `oneOf` for each action).

Provisioning Steps
- Write `data.json` at the path above and reload the plugin.
- If you change `syncInterval`, the internal metadata cycle timer uses the updated value immediately.
- To enable context‑menu items in the editor, ensure `enableEditorRightClickMenu` is `true`.

Source Pointers
- Defaults and types: `packages/core/src/Settings.ts`
- Button/action types: `packages/core/src/config/ButtonConfig.ts`
- Obsidian integration: `packages/obsidian/src/main.ts`

## Settings Schema (JSON)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.local/obsidian-meta-bind-plugin/meta-bind.settings.schema.json",
  "title": "Meta Bind Settings",
  "description": "Programmatic configuration for Meta Bind (global data.json). Based on packages/core/src/Settings.ts and packages/core/src/config/*.ts.",
  "type": "object",
  "additionalProperties": false,
  "definitions": {
    "Weekday": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "index": {"type": "integer", "minimum": 0, "maximum": 6},
        "name": {"type": "string"},
        "shortName": {"type": "string"}
      },
      "required": ["index", "name", "shortName"]
    },
    "ButtonStyleType": {
      "enum": ["default", "primary", "destructive", "plain"]
    },
    "ButtonAction": {
      "oneOf": [
        {"type": "object", "properties": {"type": {"const": "command"}, "command": {"type": "string"}}, "required": ["type", "command"], "additionalProperties": false},
        {"type": "object", "properties": {"type": {"const": "js"}, "file": {"type": "string"}, "args": {"type": "object", "additionalProperties": true}}, "required": ["type", "file"], "additionalProperties": false},
        {"type": "object", "properties": {"type": {"const": "open"}, "link": {"type": "string"}, "newTab": {"type": "boolean"}}, "required": ["type", "link"], "additionalProperties": false},
        {"type": "object", "properties": {"type": {"const": "input"}, "str": {"type": "string"}}, "required": ["type", "str"], "additionalProperties": false},
        {"type": "object", "properties": {"type": {"const": "sleep"}, "ms": {"type": "number"}}, "required": ["type", "ms"], "additionalProperties": false},
        {"type": "object", "properties": {"type": {"const": "templaterCreateNote"}, "templateFile": {"type": "string"}, "folderPath": {"type": "string"}, "fileName": {"type": "string"}, "openNote": {"type": "boolean"}, "openIfAlreadyExists": {"type": "boolean"}}, "required": ["type", "templateFile"], "additionalProperties": false},
        {"type": "object", "properties": {"type": {"const": "runTemplaterFile"}, "templateFile": {"type": "string"}}, "required": ["type", "templateFile"], "additionalProperties": false},
        {"type": "object", "properties": {"type": {"const": "updateMetadata"}, "bindTarget": {"type": "string"}, "evaluate": {"type": "boolean"}, "value": {"type": "string"}}, "required": ["type", "bindTarget", "evaluate", "value"], "additionalProperties": false},
        {"type": "object", "properties": {"type": {"const": "createNote"}, "folderPath": {"type": "string"}, "fileName": {"type": "string"}, "openNote": {"type": "boolean"}, "openIfAlreadyExists": {"type": "boolean"}}, "required": ["type", "fileName"], "additionalProperties": false},
        {"type": "object", "properties": {"type": {"const": "replaceInNote"}, "fromLine": {"type": ["integer", "string"]}, "toLine": {"type": ["integer", "string"]}, "replacement": {"type": "string"}, "templater": {"type": "boolean"}}, "required": ["type", "fromLine", "toLine", "replacement"], "additionalProperties": false},
        {"type": "object", "properties": {"type": {"const": "replaceSelf"}, "replacement": {"type": "string"}, "templater": {"type": "boolean"}}, "required": ["type", "replacement"], "additionalProperties": false},
        {"type": "object", "properties": {"type": {"const": "regexpReplaceInNote"}, "regexp": {"type": "string"}, "regexpFlags": {"type": "string"}, "replacement": {"type": "string"}}, "required": ["type", "regexp", "replacement"], "additionalProperties": false},
        {"type": "object", "properties": {"type": {"const": "insertIntoNote"}, "line": {"type": ["integer", "string"]}, "value": {"type": "string"}, "templater": {"type": "boolean"}}, "required": ["type", "line", "value"], "additionalProperties": false},
        {"type": "object", "properties": {"type": {"const": "inlineJS"}, "code": {"type": "string"}, "args": {"type": "object", "additionalProperties": true}}, "required": ["type", "code"], "additionalProperties": false}
      ]
    },
    "ButtonConfig": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "label": {"type": "string"},
        "icon": {"type": "string"},
        "style": {"$ref": "#/$defs/ButtonStyleType"},
        "class": {"type": "string"},
        "cssStyle": {"type": "string"},
        "backgroundImage": {"type": "string"},
        "tooltip": {"type": "string"},
        "id": {"type": "string"},
        "hidden": {"type": "boolean"},
        "action": {"$ref": "#/$defs/ButtonAction"},
        "actions": {"type": "array", "items": {"$ref": "#/$defs/ButtonAction"}}
      },
      "required": ["label", "style"]
    },
    "InputFieldTemplate": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "name": {"type": "string"},
        "declaration": {"type": "string"}
      },
      "required": ["name", "declaration"]
    }
  },
  "properties": {
    "devMode": {"type": "boolean", "default": false},
    "ignoreCodeBlockRestrictions": {"type": "boolean", "default": false},
    "preferredDateFormat": {"type": "string", "default": "YYYY-MM-DD"},
    "firstWeekday": {"$ref": "#/$defs/Weekday", "default": {"index": 1, "name": "Monday", "shortName": "Mo"}},
    "syncInterval": {"type": "integer", "minimum": 50, "maximum": 1000, "default": 200},
    "enableJs": {"type": "boolean", "default": false},
    "viewFieldDisplayNullAsEmpty": {"type": "boolean", "default": false},
    "enableSyntaxHighlighting": {"type": "boolean", "default": true},
    "enableEditorRightClickMenu": {"type": "boolean", "default": true},
    "inputFieldTemplates": {"type": "array", "items": {"$ref": "#/$defs/InputFieldTemplate"}, "default": []},
    "buttonTemplates": {"type": "array", "items": {"$ref": "#/$defs/ButtonConfig"}, "default": []},
    "excludedFolders": {"type": "array", "items": {"type": "string"}, "default": ["templates"]}
  }
}
```

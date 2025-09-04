# Commander — Config + Schema

- Plugin: Commander (`cmdr`) v0.5.4
- Source: `obsidian-commander`

## Configuration

**Commander: Programmatic Configuration (v0.5.4)**

- **Plugin ID:** `cmdr`
- **Settings File:** `<YOUR_VAULT>/.obsidian/plugins/cmdr/data.json`
- **Schema:** `schema/commander.settings.schema.json`

Overview
- Place commands (with icons) across many UI locations and define Macros (sequences of command/delay/loop steps). Settings are merged with defaults and saved via `saveData()`.

Key Settings
- Menus/Areas: `editorMenu`, `fileMenu`, `leftRibbon`, `rightRibbon`, `titleBar`, `statusBar`, `pageHeader`, `explorer` — arrays of `{ id, icon, name, mode, color? }`.
- Macros: `macros[]` with `macro[]` steps using action codes `0=COMMAND`, `1=DELAY`, `2=EDITOR`, `3=LOOP` (see schema for fields).
- Visibility: `hide.statusbar[]`, `hide.leftRibbon[]` to remove specific items by id.
- Advanced Toolbar: `advancedToolbar.{rowHeight,rowCount,spacing,buttonWidth,columnLayout,mappedIcons[],tooltips,heightOffset}`.
- Misc: `confirmDeletion`, `showAddCommand`, `debug`, global `spacing` between buttons.

data.json (minimal scaffold)
```json
{
  "confirmDeletion": true,
  "showAddCommand": true,
  "editorMenu": [],
  "fileMenu": [],
  "macros": [],
  "advancedToolbar": { "rowHeight": 48, "rowCount": 1, "spacing": 0, "buttonWidth": 48, "columnLayout": false, "mappedIcons": [], "tooltips": false, "heightOffset": 0 }
}
```

Source Pointers
- Defaults: `src/constants.ts`
- Types: `src/types.ts`
- Load/save: `src/main.ts`

## Settings Schema (JSON)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.local/obsidian-commander/commander.settings.schema.json",
  "title": "Commander Settings",
  "description": "Programmatic configuration for the Commander plugin. Based on src/types.ts and src/constants.ts.",
  "type": "object",
  "additionalProperties": false,
  "definitions": {
    "CommandIconPair": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "id": {"type": "string"},
        "icon": {"type": "string"},
        "name": {"type": "string"},
        "mode": {"type": "string"},
        "color": {"type": "string"}
      },
      "required": ["id", "icon", "name", "mode"]
    },
    "MacroItem": {
      "oneOf": [
        {"type": "object", "properties": {"action": {"const": 0}, "commandId": {"type": "string"}}, "required": ["action", "commandId"], "additionalProperties": false},
        {"type": "object", "properties": {"action": {"const": 1}, "delay": {"type": "number"}}, "required": ["action", "delay"], "additionalProperties": false},
        {"type": "object", "properties": {"action": {"const": 2}}, "required": ["action"], "additionalProperties": false},
        {"type": "object", "properties": {"action": {"const": 3}, "times": {"type": "number"}, "commandId": {"type": "string"}}, "required": ["action", "times", "commandId"], "additionalProperties": false}
      ]
    },
    "Macro": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "name": {"type": "string"},
        "icon": {"type": "string"},
        "startup": {"type": "boolean"},
        "macro": {"type": "array", "items": {"$ref": "#/$defs/MacroItem"}}
      },
      "required": ["name", "icon", "macro"]
    },
    "AdvancedToolbarSettings": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "rowHeight": {"type": "number"},
        "rowCount": {"type": "number"},
        "spacing": {"type": "number"},
        "buttonWidth": {"type": "number"},
        "columnLayout": {"type": "boolean"},
        "mappedIcons": {"type": "array", "items": {"type": "object", "properties": {"iconID": {"type": "string"}, "commandID": {"type": "string"}}, "required": ["iconID", "commandID"], "additionalProperties": false}},
        "tooltips": {"type": "boolean"},
        "heightOffset": {"type": "number"}
      },
      "required": ["rowHeight", "rowCount", "spacing", "buttonWidth", "columnLayout", "mappedIcons", "tooltips", "heightOffset"]
    }
  },
  "properties": {
    "confirmDeletion": {"type": "boolean"},
    "showAddCommand": {"type": "boolean"},
    "debug": {"type": "boolean"},
    "editorMenu": {"type": "array", "items": {"$ref": "#/$defs/CommandIconPair"}},
    "fileMenu": {"type": "array", "items": {"$ref": "#/$defs/CommandIconPair"}},
    "leftRibbon": {"type": "array", "items": {"$ref": "#/$defs/CommandIconPair"}},
    "rightRibbon": {"type": "array", "items": {"$ref": "#/$defs/CommandIconPair"}},
    "titleBar": {"type": "array", "items": {"$ref": "#/$defs/CommandIconPair"}},
    "statusBar": {"type": "array", "items": {"$ref": "#/$defs/CommandIconPair"}},
    "pageHeader": {"type": "array", "items": {"$ref": "#/$defs/CommandIconPair"}},
    "explorer": {"type": "array", "items": {"$ref": "#/$defs/CommandIconPair"}},
    "macros": {"type": "array", "items": {"$ref": "#/$defs/Macro"}},
    "hide": {"type": "object", "additionalProperties": false, "properties": {"statusbar": {"type": "array", "items": {"type": "string"}}, "leftRibbon": {"type": "array", "items": {"type": "string"}}}},
    "spacing": {"type": "number"},
    "advancedToolbar": {"$ref": "#/$defs/AdvancedToolbarSettings"}
  }
}
```


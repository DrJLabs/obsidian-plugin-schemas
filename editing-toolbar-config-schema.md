# Editing Toolbar — Config + Schema

- Plugin: Editing Toolbar (`editing-toolbar`) v3.1.18
- Source: `obsidian-editing-toolbar`

## Configuration

**Editing Toolbar: Programmatic Configuration (v3.1.18)**

- **Plugin ID:** `editing-toolbar`
- **Settings File:** `<YOUR_VAULT>/.obsidian/plugins/editing-toolbar/data.json`
- **Schema:** `schema/editing-toolbar.settings.schema.json`

Overview
- Highly customizable toolbar with nested submenu commands, multiple placement modes and styling options.
- Settings are merged with `DEFAULT_SETTINGS` on load and saved via `saveData()`.

Key Settings
- Layout/Style: `aestheticStyle` (`default|tiny|glass|custom`), `positionStyle` (`following|top|fixed`), `cMenuWidth`, `cMenuNumRows`, colors (`cMenuFontColor`, `cMenuBackgroundColor`, `custom_bg*`, `custom_fc*`).
- Behavior: `appendMethod` (`body|workspace`), `shouldShowMenuOnSelect`, `autohide`, `Iscentered`, `cMenuVisibility`, `isLoadOnMobile`.
- Placement command lists: `menuCommands`, `followingCommands`, `topCommands`, `fixedCommands`, `mobileCommands` (support nested `SubmenuCommands`).
- Per‑view toggles: `viewTypeSettings` (map of viewType → boolean).
- Format brush toggles: `formatBrushes` (map of key → boolean).
- Custom insert actions: `customCommands[]` with prefix/suffix or regex options.

Allowed Values Summary
- `aestheticStyle`: `default`, `tiny`, `glass`, `custom`.
- `positionStyle`: `following`, `top`, `fixed`.
- `appendMethod`: `body`, `workspace`.

data.json (minimal scaffold)
```json
{
  "aestheticStyle": "top",
  "positionStyle": "default",
  "appendMethod": "workspace",
  "menuCommands": [],
  "followingCommands": [],
  "topCommands": [],
  "fixedCommands": [],
  "mobileCommands": []
}
```

Source Pointers
- Types and defaults: `src/settings/settingsData.ts`
- Load/save behavior: `src/plugin/main.ts`

## Settings Schema (JSON)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.local/obsidian-editing-toolbar/editing-toolbar.settings.schema.json",
  "title": "Editing Toolbar Settings",
  "description": "Programmatic configuration for the Editing Toolbar plugin. Based on src/settings/settingsData.ts.",
  "type": "object",
  "additionalProperties": false,
  "definitions": {
    "Command": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "icon": {"type": "string"},
        "SubmenuCommands": {"type": "array", "items": {"$ref": "#/$defs/Command"}}
      },
      "required": ["id", "name"]
    },
    "CustomCommand": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "prefix": {"type": "string"},
        "suffix": {"type": "string"},
        "char": {"type": "number"},
        "line": {"type": "number"},
        "islinehead": {"type": "boolean"},
        "icon": {"type": "string"},
        "useRegex": {"type": "boolean"},
        "regexPattern": {"type": "string"},
        "regexReplacement": {"type": "string"},
        "regexCaseInsensitive": {"type": "boolean"},
        "regexGlobal": {"type": "boolean"},
        "regexMultiline": {"type": "boolean"},
        "useCondition": {"type": "boolean"},
        "conditionPattern": {"type": "string"}
      },
      "required": ["id", "name", "prefix", "suffix", "char", "line", "islinehead"]
    }
  },
  "properties": {
    "lastVersion": {"type": "string"},
    "cMenuWidth": {"type": "number"},
    "cMenuFontColor": {"type": "string"},
    "cMenuBackgroundColor": {"type": "string"},
    "aestheticStyle": {"type": "string", "description": "Toolbar visual style preset.", "enum": ["default", "tiny", "glass", "custom"]},
    "positionStyle": {"type": "string", "description": "Toolbar positioning mode.", "enum": ["following", "top", "fixed"]},
    "menuCommands": {"type": "array", "items": {"$ref": "#/$defs/Command"}},
    "followingCommands": {"type": "array", "items": {"$ref": "#/$defs/Command"}},
    "topCommands": {"type": "array", "items": {"$ref": "#/$defs/Command"}},
    "fixedCommands": {"type": "array", "items": {"$ref": "#/$defs/Command"}},
    "mobileCommands": {"type": "array", "items": {"$ref": "#/$defs/Command"}},
    "enableMultipleConfig": {"type": "boolean"},
    "appendMethod": {"type": "string", "description": "Where to insert the toolbar container in the DOM.", "enum": ["body", "workspace"]},
    "shouldShowMenuOnSelect": {"type": "boolean"},
    "cMenuVisibility": {"type": "boolean"},
    "cMenuBottomValue": {"type": "number"},
    "cMenuNumRows": {"type": "number"},
    "autohide": {"type": "boolean"},
    "Iscentered": {"type": "boolean"},
    "custom_bg1": {"type": "string"},
    "custom_bg2": {"type": "string"},
    "custom_bg3": {"type": "string"},
    "custom_bg4": {"type": "string"},
    "custom_bg5": {"type": "string"},
    "custom_fc1": {"type": "string"},
    "custom_fc2": {"type": "string"},
    "custom_fc3": {"type": "string"},
    "custom_fc4": {"type": "string"},
    "custom_fc5": {"type": "string"},
    "isLoadOnMobile": {"type": "boolean"},
    "horizontalPosition": {"type": "number"},
    "verticalPosition": {"type": "number"},
    "formatBrushes": {"type": "object", "additionalProperties": {"type": "boolean"}},
    "customCommands": {"type": "array", "items": {"$ref": "#/$defs/CustomCommand"}},
    "viewTypeSettings": {"type": "object", "additionalProperties": {"type": "boolean"}},
    "toolbarBackgroundColor": {"type": "string"},
    "toolbarIconColor": {"type": "string"},
    "toolbarIconSize": {"type": "number"}
  }
}
```

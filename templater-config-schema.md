# Templater — Config + Schema

- Plugin: Templater (`templater-obsidian`) v2.14.1
- Source: `Templater`

## Configuration

**Templater: Programmatic Configuration (v2.14.1)**

- **Plugin ID:** `templater-obsidian`
- **Settings File:** `<YOUR_VAULT>/.obsidian/plugins/templater-obsidian/data.json`
- **Schema:** `schema/templater.settings.schema.json`

Overview
- Templater merges `DEFAULT_SETTINGS` with saved data and persists the whole object.
- Folder/file trigger rules only apply when `trigger_on_file_creation` is enabled.
- `intellisense_render` controls in‑editor hint rendering; see enum values in the schema description.

Key Defaults (source‑derived)
- `command_timeout`: 5 (seconds)
- `templates_folder`: ""
- `templates_pairs`: [["", ""]]
- `trigger_on_file_creation`: false
- `auto_jump_to_cursor`: false
- `enable_system_commands`: false; `shell_path`: ""; `user_scripts_folder`: ""
- `enable_folder_templates`: true; `folder_templates`: [{ folder: "", template: "" }]
- `enable_file_templates`: false; `file_templates`: [{ regex: ".*", template: "" }]
- `syntax_highlighting`: true; `syntax_highlighting_mobile`: false
- `enabled_templates_hotkeys`: [""]
- `startup_templates`: [""]
- `intellisense_render`: 1 (Description+Parameters+Return)

Allowed Values Summary
- `intellisense_render`: 0=Off, 1=Description+Params+Return, 2=Description+Param list, 3=Description+Return, 4=Description only.

data.json (minimal defaults)
```json
{
  "command_timeout": 5,
  "templates_folder": "",
  "templates_pairs": [["", ""]],
  "trigger_on_file_creation": false,
  "auto_jump_to_cursor": false,
  "enable_system_commands": false,
  "shell_path": "",
  "user_scripts_folder": "",
  "enable_folder_templates": true,
  "folder_templates": [{"folder": "", "template": ""}],
  "enable_file_templates": false,
  "file_templates": [{"regex": ".*", "template": ""}],
  "syntax_highlighting": true,
  "syntax_highlighting_mobile": false,
  "enabled_templates_hotkeys": [""],
  "startup_templates": [""],
  "intellisense_render": 1
}
```

Provisioning Steps
- Write `data.json` at the path above and reload Obsidian.
- For folder/file triggers, supply concrete folder/template entries and enable the corresponding toggle.

Source Pointers
- Defaults and types: `src/settings/Settings.ts`
- Intellisense options: `src/settings/RenderSettings/IntellisenseRenderOption.ts`

## Settings Schema (JSON)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.local/templater/templater.settings.schema.json",
  "title": "Templater Settings",
  "description": "Programmatic configuration for Templater. Based on src/settings/Settings.ts.",
  "type": "object",
  "additionalProperties": false,
  "$defs": {
    "FolderTemplate": {"type": "object", "properties": {"folder": {"type": "string"}, "template": {"type": "string"}}, "required": ["folder", "template"], "additionalProperties": false},
    "FileTemplate": {"type": "object", "properties": {"regex": {"type": "string"}, "template": {"type": "string"}}, "required": ["regex", "template"], "additionalProperties": false},
    "IntellisenseRenderOption": {"type": "integer", "enum": [0,1,2,3,4], "description": "0=Off, 1=Description+Params+Return, 2=Description+Param list, 3=Description+Return, 4=Description only"}
  },
  "properties": {
    "command_timeout": {"type": "integer", "minimum": 0, "default": 5},
    "templates_folder": {"type": "string", "default": ""},
    "templates_pairs": {"type": "array", "items": {"type": "array", "prefixItems": [{"type": "string"}, {"type": "string"}], "minItems": 2, "maxItems": 2}, "default": [["",""]]},
    "trigger_on_file_creation": {"type": "boolean", "default": false},
    "auto_jump_to_cursor": {"type": "boolean", "default": false},
    "enable_system_commands": {"type": "boolean", "default": false},
    "shell_path": {"type": "string", "default": ""},
    "user_scripts_folder": {"type": "string", "default": ""},
    "enable_folder_templates": {"type": "boolean", "default": true},
    "folder_templates": {"type": "array", "items": {"$ref": "#/$defs/FolderTemplate"}, "default": [{"folder": "", "template": ""}]},
    "enable_file_templates": {"type": "boolean", "default": false},
    "file_templates": {"type": "array", "items": {"$ref": "#/$defs/FileTemplate"}, "default": [{"regex": ".*", "template": ""}]},
    "syntax_highlighting": {"type": "boolean", "default": true},
    "syntax_highlighting_mobile": {"type": "boolean", "default": false},
    "enabled_templates_hotkeys": {"type": "array", "items": {"type": "string"}, "default": [""]},
    "startup_templates": {"type": "array", "items": {"type": "string"}, "default": [""]},
    "intellisense_render": {"$ref": "#/$defs/IntellisenseRenderOption", "default": 1}
  }
}
```

# Style Settings — Config + Schema

- Plugin: Style Settings (`obsidian-style-settings`) v1.0.9
- Source: `obsidian-style-settings`

## Configuration

**Style Settings: Programmatic Configuration (v1.0.9)**

- **Plugin ID:** `obsidian-style-settings`
- **Settings File:** `<YOUR_VAULT>/.obsidian/plugins/obsidian-style-settings/data.json`
- **Schema:** `schema/style-settings.schema.json`

Overview
- Style Settings parses special CSS comments from installed themes, snippets, and some plugins to dynamically generate controls. There is no fixed setting list in the codebase; instead, it uses a key–value map to set CSS variables and toggle classes.
- Keys follow the pattern `sectionId@@settingId` with optional theme suffix `@@light` or `@@dark` for themed colors.
- Values are strings, numbers, or booleans, depending on each setting’s type (number, text, select, color, class toggle/select, etc.).

data.json structure
- Object where each property key is a setting identifier and the value is the configured value.
- Unknown or obsolete keys are pruned automatically when the parsed settings change.

Examples
```json
{
  "Theme@@base-hue": 210,
  "Theme@@accent-color": "#7aa2f7",
  "Theme@@accent-color@@light": "#89b4fa",
  "Theme@@accent-color@@dark": "#74c7ec",
  "Theme@@ui-density": "compact",
  "Theme@@show-reading-time": true,
  "MyPlugin@@enable-experimental": false
}
```

Behavior
- When values are set, the plugin writes CSS variables to the document body and toggles classes as required, then emits a `css-change` event.
- Clearing entries (removing keys) reverts to the theme/snippet defaults.
- Keys not recognized by the current theme/snippet are removed on the next parse.

Provisioning Steps
- Write the desired map to `data.json` and reload Obsidian or toggle the plugin.
- Use `@@light`/`@@dark` suffixes for themed color overrides; omit the suffix to set non-themed variables.

Source Pointers
- Persistence and application: `src/SettingsManager.ts`
- Dynamic parsing: `src/main.ts`, `src/SettingHandlers.ts`, `src/settingsView/*`

## Settings Schema (JSON)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.local/obsidian-style-settings/style-settings.schema.json",
  "title": "Style Settings Values",
  "description": "Key-value map used by Style Settings to set CSS variables and classes. Keys follow the pattern <sectionId>@@<settingId>[@@dark|@@light].",
  "type": "object",
  "additionalProperties": false,
  "patternProperties": {
    "^[^@]+@@[^@]+(?:@@(?:dark|light))?$": {
      "type": ["string", "number", "boolean"],
      "description": "Value for the referenced setting; type depends on the setting definition parsed from CSS."
    }
  }
}
```


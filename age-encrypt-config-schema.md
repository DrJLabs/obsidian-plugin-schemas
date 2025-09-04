# Age Encrypt — Config + Schema

- Plugin: Age Encrypt (`age-encrypt`) v1.2.0
- Source: `obsidian-age-encrypt`

## Configuration

**Age Encrypt: Programmatic Configuration (v1.2.0)**

- **Plugin ID:** `age-encrypt`
- **Settings File:** `<YOUR_VAULT>/.obsidian/plugins/age-encrypt/data.json`
- **Schema:** `schema/age-encrypt.settings.schema.json`

Overview
- Settings are loaded with `Object.assign({}, DEFAULT_SETTINGS, loaded)` and saved back via `saveData()`.
- Available settings (from `src/settings.ts`):
  - `excludeFrontmatter` (boolean, default `true`): When encrypting an entire file, YAML frontmatter is preserved unencrypted.
  - `defaultHint` (string, optional): Optional default hint text for encrypted blocks.

data.json (defaults)
```json
{
  "excludeFrontmatter": true,
  "defaultHint": ""
}
```

Usage Notes
- Encrypt selection: Command “Encrypt selection” inserts an `age` code block. If a hint is provided, it is shown in the block UI.
- Encrypt file: Command “Encrypt file” will optionally strip frontmatter (if `excludeFrontmatter` is true) before encrypting the remainder.

Source Pointers
- Types and defaults: `src/settings.ts`
- Load/save and behavior: `main.ts`

## Settings Schema (JSON)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.local/obsidian-age-encrypt/age-encrypt.settings.schema.json",
  "title": "Age Encrypt Settings",
  "description": "Programmatic configuration for the Age Encrypt plugin. Based on src/settings.ts and main.ts.",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "defaultHint": {
      "type": "string",
      "description": "Optional default hint text shown with encrypted blocks.",
      "default": ""
    },
    "excludeFrontmatter": {
      "type": "boolean",
      "description": "When encrypting an entire file, keep YAML frontmatter in plaintext.",
      "default": true
    }
  }
}
```


# QuickAdd — Config + Schema

- Plugin: QuickAdd (`quickadd`) v2.1.0
- Source: `quickadd`

## Configuration

**QuickAdd: Programmatic Configuration (v2.1.0)**

- **Plugin ID:** `quickadd`
- **Settings File:** `<YOUR_VAULT>/.obsidian/plugins/quickadd/data.json`
- **Schema:** `schema/quickadd.settings.schema.json`

Overview
- QuickAdd stores a rich settings object including an array of Choices (Capture, Template, Macro, Multi), general flags, and optional AI helpers.
- Defaults: see `src/quickAddSettingsTab.ts` (`DEFAULT_SETTINGS`). The app loads `Object.assign({}, DEFAULT_SETTINGS, loaded)`.

Security note
- Provider API keys in `ai.providers[].apiKey` are stored in plaintext in `data.json`. For shared repos, omit keys and inject at runtime via your own scripts or local-only provisioning.

Key Defaults (source‑derived)
- `inputPrompt`: `single-line`
- `devMode`: false
- `templateFolderPath`: ""
- `announceUpdates`: true
- `version`: "0.0.0"
- `onePageInputEnabled`: false
- `disableOnlineFeatures`: true
- `enableRibbonIcon`: false
- `showCaptureNotification`: true
- `ai.defaultModel`: "Ask me"; `ai.showAssistant`: true; `ai.providers`: `DefaultProviders`

Allowed Values Summary
- `inputPrompt`: `single-line` or `multi-line`.
- `OpenLocation` (for file opening): `reuse`, `tab`, `split`, `window`, `left-sidebar`, `right-sidebar`.
- `FileViewMode2.mode`: `preview`, `source`, `live`, `live-preview`, or `default`.
- `appendLink.placement`: `replaceSelection`, `afterSelection`, `endOfLine`, `newLine`.
- `newLineCapture.direction`: `above` or `below`.
- `fileOpening.direction`: `vertical` or `horizontal`.

data.json (minimal scaffold)
```json
{
  "choices": [],
  "inputPrompt": "single-line",
  "devMode": false,
  "templateFolderPath": "",
  "announceUpdates": true,
  "version": "0.0.0",
  "onePageInputEnabled": false,
  "disableOnlineFeatures": true,
  "enableRibbonIcon": false,
  "showCaptureNotification": true,
  "ai": {
    "defaultModel": "Ask me",
    "defaultSystemPrompt": "",
    "promptTemplatesFolderPath": "",
    "showAssistant": true,
    "providers": []
  },
  "migrations": {
    "migrateToMacroIDFromEmbeddedMacro": true,
    "useQuickAddTemplateFolder": false,
    "incrementFileNameSettingMoveToDefaultBehavior": false,
    "mutualExclusionInsertAfterAndWriteToBottomOfFile": false,
    "setVersionAfterUpdateModalRelease": false,
    "addDefaultAIProviders": false,
    "removeMacroIndirection": false,
    "migrateFileOpeningSettings": false
  }
}
```

Choice examples
- Capture
```json
{
  "name": "Capture to Inbox",
  "id": "capture-inbox",
  "type": "Capture",
  "command": true,
  "captureTo": "Inbox.md",
  "captureToActiveFile": false,
  "createFileIfItDoesntExist": { "enabled": true, "createWithTemplate": false, "template": "" },
  "format": { "enabled": true, "format": "- {{VALUE}}" },
  "prepend": false,
  "appendLink": { "enabled": true, "placement": "endOfLine" },
  "task": false,
  "insertAfter": { "enabled": false, "after": "## Tasks", "insertAtEnd": false, "considerSubsections": true, "createIfNotFound": false, "createIfNotFoundLocation": "" },
  "newLineCapture": { "enabled": true, "direction": "below" },
  "openFile": false,
  "fileOpening": { "location": "tab", "direction": "vertical", "mode": "default", "focus": true }
}
```

Provisioning Steps
- Write `data.json` using the schema, reload Obsidian or toggle QuickAdd.
- For AI, populate `ai.providers` with endpoints and models. Keep `apiKey` local-only.

Source Pointers
- Defaults and settings: `src/quickAddSettingsTab.ts`, `src/settingsStore.ts`
- Choice types: `src/types/choices/*`
- File opening / link placement: `src/types/fileOpening.ts`, `src/types/linkPlacement.ts`

## Settings Schema (JSON)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.local/quickadd/quickadd.settings.schema.json",
  "title": "QuickAdd Settings",
  "description": "Programmatic configuration for QuickAdd. Based on src/quickAddSettingsTab.ts and related types.",
  "type": "object",
  "additionalProperties": false,
  "$defs": {
    "AIProvider": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "name": {"type": "string", "description": "Provider display name (e.g., OpenAI, Local-OAI)."},
        "endpoint": {"type": "string", "description": "Base URL for the provider API endpoint."},
        "apiKey": {"type": "string", "description": "API key or token; store locally only."},
        "models": {
          "type": "array",
          "items": {"type": "object", "properties": {"name": {"type": "string", "description": "Model identifier"}, "maxTokens": {"type": "integer", "minimum": 1, "description": "Maximum token limit for this model"}}, "required": ["name", "maxTokens"], "additionalProperties": false}
        },
        "autoSyncModels": {"type": "boolean", "description": "Automatically refresh models from the provider"}
      },
      "required": ["name", "endpoint", "apiKey", "models"]
    },
    "OpenLocation": {"enum": ["reuse", "tab", "split", "window", "left-sidebar", "right-sidebar"], "description": "Where to open the target file/view."},
    "FileViewMode2": {"anyOf": [
      {"enum": ["preview", "source", "live", "live-preview", "default"]},
      {"type": "object", "properties": {"mode": {"enum": ["preview"]}}, "required": ["mode"], "additionalProperties": true},
      {"type": "object", "properties": {"mode": {"enum": ["source", "default"]}}, "required": ["mode"], "additionalProperties": true}
    ]},
    "AppendLinkOptions": {"type": "object", "properties": {"enabled": {"type": "boolean"}, "placement": {"enum": ["replaceSelection", "afterSelection", "endOfLine", "newLine"]}}, "required": ["enabled", "placement"], "additionalProperties": false},
    "IChoiceBase": {"type": "object", "properties": {"name": {"type": "string"}, "id": {"type": "string"}, "type": {"enum": ["Capture", "Macro", "Multi", "Template"]}, "command": {"type": "boolean"}, "onePageInput": {"anyOf": [{"enum": ["always", "never"]}, {"type": "null"}]}}, "required": ["name", "id", "type", "command"], "additionalProperties": true},
    "CaptureChoice": {
      "allOf": [
        {"$ref": "#/$defs/IChoiceBase"},
        {"type": "object", "properties": {
          "type": {"const": "Capture"},
          "captureTo": {"type": "string"},
          "captureToActiveFile": {"type": "boolean"},
          "createFileIfItDoesntExist": {"type": "object", "properties": {"enabled": {"type": "boolean"}, "createWithTemplate": {"type": "boolean"}, "template": {"type": "string"}}, "required": ["enabled", "createWithTemplate", "template"], "additionalProperties": false},
          "format": {"type": "object", "properties": {"enabled": {"type": "boolean"}, "format": {"type": "string"}}, "required": ["enabled", "format"], "additionalProperties": false},
          "prepend": {"type": "boolean"},
          "appendLink": {"oneOf": [{"type": "boolean"}, {"$ref": "#/$defs/AppendLinkOptions"}]},
          "task": {"type": "boolean"},
          "insertAfter": {"type": "object", "properties": {"enabled": {"type": "boolean"}, "after": {"type": "string"}, "insertAtEnd": {"type": "boolean"}, "considerSubsections": {"type": "boolean"}, "createIfNotFound": {"type": "boolean"}, "createIfNotFoundLocation": {"type": "string"}}, "required": ["enabled", "after", "insertAtEnd", "considerSubsections", "createIfNotFound", "createIfNotFoundLocation"], "additionalProperties": false},
          "newLineCapture": {"type": "object", "properties": {"enabled": {"type": "boolean"}, "direction": {"enum": ["above", "below"]}}, "required": ["enabled", "direction"], "additionalProperties": false},
          "openFile": {"type": "boolean"},
          "fileOpening": {"type": "object", "properties": {"location": {"$ref": "#/$defs/OpenLocation"}, "direction": {"enum": ["vertical", "horizontal"]}, "mode": {"$ref": "#/$defs/FileViewMode2"}, "focus": {"type": "boolean"}}, "additionalProperties": false}
        }, "required": ["type"]}
      ]
    },
    "TemplateChoice": {
      "allOf": [
        {"$ref": "#/$defs/IChoiceBase"},
        {"type": "object", "properties": {"type": {"const": "Template"}, "templatePath": {"type": "string"}, "folder": {"type": "object", "properties": {"enabled": {"type": "boolean"}, "folders": {"type": "array", "items": {"type": "string"}}, "chooseWhenCreatingNote": {"type": "boolean"}, "createInSameFolderAsActiveFile": {"type": "boolean"}, "chooseFromSubfolders": {"type": "boolean"}}, "required": ["enabled", "folders", "chooseWhenCreatingNote", "createInSameFolderAsActiveFile", "chooseFromSubfolders"], "additionalProperties": false}, "fileNameFormat": {"type": "object", "properties": {"enabled": {"type": "boolean"}, "format": {"type": "string"}}, "required": ["enabled", "format"], "additionalProperties": false}, "appendLink": {"oneOf": [{"type": "boolean"}, {"$ref": "#/$defs/AppendLinkOptions"}]}, "openFile": {"type": "boolean"}, "fileOpening": {"type": "object", "properties": {"location": {"$ref": "#/$defs/OpenLocation"}, "direction": {"enum": ["vertical", "horizontal"]}, "mode": {"$ref": "#/$defs/FileViewMode2"}, "focus": {"type": "boolean"}}, "additionalProperties": false}, "fileExistsMode": {"type": ["string", "number"]}, "setFileExistsBehavior": {"type": "boolean"}}, "required": ["type", "templatePath"]}
      ]
    },
    "MacroChoice": {
      "allOf": [
        {"$ref": "#/$defs/IChoiceBase"},
        {"type": "object", "properties": {"type": {"const": "Macro"}, "macro": {"type": "object", "properties": {"name": {"type": "string"}, "id": {"type": "string"}, "commands": {"type": "array", "items": {"type": "object", "properties": {"name": {"type": "string"}, "type": {"type": "string"}, "id": {"type": "string"}}, "required": ["name", "type", "id"], "additionalProperties": true}}}, "required": ["name", "id", "commands"], "additionalProperties": true}, "runOnStartup": {"type": "boolean"}}, "required": ["type", "macro"]}
      ]
    },
    "MultiChoice": {
      "allOf": [
        {"$ref": "#/$defs/IChoiceBase"},
        {"type": "object", "properties": {"type": {"const": "Multi"}, "choices": {"type": "array", "items": {"$ref": "#/$defs/IChoiceBase"}}, "collapsed": {"type": "boolean"}}, "required": ["type", "choices", "collapsed"]}
      ]
    },
    "Choice": {
      "oneOf": [
        {"$ref": "#/$defs/CaptureChoice"},
        {"$ref": "#/$defs/TemplateChoice"},
        {"$ref": "#/$defs/MacroChoice"},
        {"$ref": "#/$defs/MultiChoice"}
      ]
    }
  },
  "properties": {
    "choices": {"type": "array", "description": "Configured QuickAdd choices (Capture, Template, Macro, Multi).", "items": {"$ref": "#/$defs/Choice"}},
    "inputPrompt": {"enum": ["multi-line", "single-line"], "description": "Prompt input mode for QuickAdd dialogs.", "default": "single-line"},
    "devMode": {"type": "boolean", "default": false},
    "templateFolderPath": {"type": "string", "default": ""},
    "announceUpdates": {"type": "boolean", "default": true},
    "version": {"type": "string", "default": "0.0.0"},
    "onePageInputEnabled": {"type": "boolean", "default": false},
    "disableOnlineFeatures": {"type": "boolean", "default": true},
    "enableRibbonIcon": {"type": "boolean", "default": false},
    "showCaptureNotification": {"type": "boolean", "default": true},
    "ai": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "defaultModel": {"type": "string", "description": "Default model label to suggest in UI.", "default": "Ask me"},
        "defaultSystemPrompt": {"type": "string", "description": "System prompt text to prepend for AI actions."},
        "promptTemplatesFolderPath": {"type": "string", "description": "Folder containing AI prompt templates.", "default": ""},
        "showAssistant": {"type": "boolean", "description": "Show the assistant UI within QuickAdd.", "default": true},
        "providers": {"type": "array", "description": "Configured AI providers.", "items": {"$ref": "#/$defs/AIProvider"}}
      },
      "required": ["defaultModel", "defaultSystemPrompt", "promptTemplatesFolderPath", "showAssistant", "providers"]
    },
    "migrations": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "migrateToMacroIDFromEmbeddedMacro": {"type": "boolean", "description": "One-time migration flag for transitioning to Macro IDs."},
        "useQuickAddTemplateFolder": {"type": "boolean", "description": "Whether to migrate to QuickAdd-specific template folder settings."},
        "incrementFileNameSettingMoveToDefaultBehavior": {"type": "boolean", "description": "Migration flag for filename behavior changes."},
        "mutualExclusionInsertAfterAndWriteToBottomOfFile": {"type": "boolean", "description": "Migration flag to enforce settings exclusivity."},
        "setVersionAfterUpdateModalRelease": {"type": "boolean", "description": "Set version after update modal release."},
        "addDefaultAIProviders": {"type": "boolean", "description": "Add default AI providers during migration if missing."},
        "removeMacroIndirection": {"type": "boolean", "description": "Remove indirect macro references during migration."},
        "migrateFileOpeningSettings": {"type": "boolean", "description": "Normalize file opening settings to new structure."}
      }
    }
  }
}
```

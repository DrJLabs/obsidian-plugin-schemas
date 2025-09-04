# Quick Switcher++ — Config + Schema

- Plugin: Quick Switcher++ (`darlal-switcher-plus`) v5.3.1
- Source: `obsidian-switcher-plus`

## Configuration

**Quick Switcher++: Programmatic Configuration (v5.3.1)**

- **Plugin ID:** `darlal-switcher-plus`
- **Settings File:** `<YOUR_VAULT>/.obsidian/plugins/darlal-switcher-plus/data.json`
- **Schema:** `schema/switcher-plus.settings.schema.json`

Overview
- Enhanced quick switcher with multiple modes, symbol search, related items, customizable hotkeys and behaviors. Settings are persisted with `saveData()`; the schema captures the top‑level fields from `src/types/sharedTypes.ts`.

Highlights
- Modes and commands: `*ListCommand` string ids, `enabledRibbonCommands[]` (enum of mode names).
- Search behavior: flags like `shouldSearchHeadings`, `searchAllHeadings`, `shouldSearchFilenames`, `pathDisplayFormat` (enum 0–4), `selectNearestHeading`.
- Related items: `enabledRelatedItems[]` (`disk-location|backlink|outgoing-link`), folder/file extension filters.
- UI/UX: `recentCommandDisplayOrder`, `maxRecentCommands`, `limit`, `hidePathIfRoot`, `showModeTriggerInstructions`.
- Hotkeys: multiple `Hotkey` objects; modelled as `{ modifiers: string[], key: string }`.
- Feature configs: `insertLinkInEditor`, `navigationKeys`, `renderMarkdownContentInSuggestions`, `quickOpen`, `openDefaultApp`, `fulltextSearch`, `openInBackground`, `mobileLauncher`.

data.json (minimal scaffold)
```json
{
  "version": "5.3.1",
  "onOpenPreferNewTab": false,
  "editorListCommand": "",
  "symbolListCommand": "",
  "enabledRibbonCommands": ["Standard"],
  "enabledRelatedItems": ["disk-location", "backlink"],
  "pathDisplayFormat": 1,
  "navigationKeys": { "nextKeys": [], "prevKeys": [] }
}
```

Source Pointers
- Types: `src/types/sharedTypes.ts`
- Settings I/O: `src/settings/switcherPlusSettings.ts`

## Settings Schema (JSON)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.local/obsidian-switcher-plus/switcher-plus.settings.schema.json",
  "title": "Quick Switcher++ Settings",
  "description": "Programmatic configuration for Quick Switcher++. Based on src/types/sharedTypes.ts and settings/switcherPlusSettings.ts.",
  "type": "object",
  "additionalProperties": true,
  "definitions": {
    "Hotkey": {"type": "object", "additionalProperties": true, "properties": {"modifiers": {"type": "array", "items": {"type": "string"}}, "key": {"type": "string"}}},
    "RelationType": {"enum": ["disk-location", "backlink", "outgoing-link"]},
    "TitleSource": {"enum": ["Default", "H1"]},
    "ModeName": {"enum": ["Standard", "EditorList", "SymbolList", "WorkspaceList", "HeadingsList", "BookmarksList", "CommandList", "RelatedItemsList", "VaultList"]},
    "OpenDefaultAppConfig": {"type": "object", "additionalProperties": false, "properties": {"isEnabled": {"type": "boolean"}, "openInDefaultAppKeys": {"$ref": "#/$defs/Hotkey"}, "excludeFileExtensions": {"type": "array", "items": {"type": "string"}}}},
    "QuickOpenConfig": {"type": "object", "properties": {"isEnabled": {"type": "boolean"}, "modifiers": {"type": "array", "items": {"type": "string"}}, "keyList": {"type": "array", "items": {"type": "string"}}}, "additionalProperties": false},
    "RenderMarkdownContentConfig": {"type": "object", "properties": {"isEnabled": {"type": "boolean"}, "renderHeadings": {"type": "boolean"}, "toggleContentRenderingKeys": {"$ref": "#/$defs/Hotkey"}}, "additionalProperties": false},
    "FulltextSearchConfig": {"type": "object", "properties": {"isEnabled": {"type": "boolean"}, "searchKeys": {"$ref": "#/$defs/Hotkey"}}, "additionalProperties": false},
    "OpenInBackgroundConfig": {"type": "object", "properties": {"isEnabled": {"type": "boolean"}, "openKeys": {"type": "array", "items": {"type": "object", "properties": {"openType": {"type": ["string", "number"]}, "hotkey": {"$ref": "#/$defs/Hotkey"}}, "required": ["openType", "hotkey"], "additionalProperties": false}}}, "additionalProperties": false},
    "NavigationKeysConfig": {"type": "object", "properties": {"nextKeys": {"type": "array", "items": {"$ref": "#/$defs/Hotkey"}}, "prevKeys": {"type": "array", "items": {"$ref": "#/$defs/Hotkey"}}}, "additionalProperties": false},
    "InsertLinkConfig": {"type": "object", "properties": {"isEnabled": {"type": "boolean"}, "insertableEditorTypes": {"type": "array", "items": {"type": "string"}}, "useBasenameAsAlias": {"type": "boolean"}, "useHeadingAsAlias": {"type": "boolean"}, "keymap": {"allOf": [{"$ref": "#/$defs/Hotkey"}, {"type": "object", "properties": {"purpose": {"type": "string"}}, "required": ["purpose"]}]}}, "additionalProperties": false}
  },
  "properties": {
    "version": {"type": "string"},
    "onOpenPreferNewTab": {"type": "boolean"},
    "alwaysNewTabForSymbols": {"type": "boolean"},
    "useActiveTabForSymbolsOnMobile": {"type": "boolean"},
    "symbolsInLineOrder": {"type": "boolean"},
    "editorListCommand": {"type": "string"},
    "symbolListCommand": {"type": "string"},
    "symbolListActiveEditorCommand": {"type": "string"},
    "workspaceListCommand": {"type": "string"},
    "headingsListCommand": {"type": "string"},
    "bookmarksListCommand": {"type": "string"},
    "commandListCommand": {"type": "string"},
    "recentCommandDisplayOrder": {"enum": ["desc", "asc"]},
    "maxRecentCommands": {"type": "number"},
    "vaultListCommand": {"type": "string"},
    "relatedItemsListCommand": {"type": "string"},
    "relatedItemsListActiveEditorCommand": {"type": "string"},
    "shouldSearchHeadings": {"type": "boolean"},
    "strictHeadingsOnly": {"type": "boolean"},
    "searchAllHeadings": {"type": "boolean"},
    "headingsSearchDebounceMilli": {"type": "number"},
    "excludeViewTypes": {"type": "array", "items": {"type": "string"}},
    "referenceViews": {"type": "array", "items": {"type": "string"}},
    "limit": {"type": "number"},
    "includeSidePanelViewTypes": {"type": "array", "items": {"type": "string"}},
    "enabledSymbolTypes": {"type": "object", "additionalProperties": {"type": "boolean"}},
    "selectNearestHeading": {"type": "boolean"},
    "excludeFolders": {"type": "array", "items": {"type": "string"}},
    "excludeLinkSubTypes": {"type": "number"},
    "excludeRelatedFolders": {"type": "array", "items": {"type": "string"}},
    "excludeOpenRelatedFiles": {"type": "boolean"},
    "excludeObsidianIgnoredFiles": {"type": "boolean"},
    "shouldSearchFilenames": {"type": "boolean"},
    "shouldSearchBookmarks": {"type": "boolean"},
    "shouldSearchRecentFiles": {"type": "boolean"},
    "pathDisplayFormat": {"type": "integer", "enum": [0,1,2,3,4]},
    "hidePathIfRoot": {"type": "boolean"},
    "enabledRelatedItems": {"type": "array", "items": {"$ref": "#/$defs/RelationType"}},
    "showOptionalIndicatorIcons": {"type": "boolean"},
    "isFileExtensionIndicatorsEnabled": {"type": "boolean"},
    "excludeFileExtensionIndicators": {"type": "array", "items": {"type": "string"}},
    "overrideStandardModeBehaviors": {"type": "boolean"},
    "overrideStandardModeRendering": {"type": "boolean"},
    "enabledRibbonCommands": {"type": "array", "items": {"$ref": "#/$defs/ModeName"}},
    "fileExtAllowList": {"type": "array", "items": {"type": "string"}},
    "matchPriorityAdjustments": {"type": "object", "additionalProperties": false, "properties": {"isEnabled": {"type": "boolean"}, "adjustments": {"type": "object", "additionalProperties": {"type": "object", "properties": {"value": {"type": "number"}, "label": {"type": "string"}, "desc": {"type": "string"}}}}, "fileExtAdjustments": {"type": "object", "additionalProperties": {"type": "object", "properties": {"value": {"type": "number"}, "label": {"type": "string"}, "desc": {"type": "string"}}}}}},
    "preserveCommandPaletteLastInput": {"type": "boolean"},
    "preserveQuickSwitcherLastInput": {"type": "boolean"},
    "quickFilters": {"type": "object", "additionalProperties": true},
    "shouldCloseModalOnBackspace": {"type": "boolean"},
    "maxRecentFileSuggestionsOnInit": {"type": "number"},
    "orderEditorListByAccessTime": {"type": "boolean"},
    "insertLinkInEditor": {"$ref": "#/$defs/InsertLinkConfig"},
    "removeDefaultTabBinding": {"type": "boolean"},
    "navigationKeys": {"$ref": "#/$defs/NavigationKeysConfig"},
    "preferredSourceForTitle": {"$ref": "#/$defs/TitleSource"},
    "closeWhenEmptyKeys": {"type": "array", "items": {"$ref": "#/$defs/Hotkey"}},
    "navigateToHotkeySelectorKeys": {"$ref": "#/$defs/Hotkey"},
    "togglePinnedCommandKeys": {"$ref": "#/$defs/Hotkey"},
    "escapeCmdChar": {"type": "string"},
    "mobileLauncher": {"type": "object", "additionalProperties": true},
    "allowCreateNewFileInModeNames": {"type": "array", "items": {"$ref": "#/$defs/ModeName"}},
    "showModeTriggerInstructions": {"type": "boolean"},
    "renderMarkdownContentInSuggestions": {"$ref": "#/$defs/RenderMarkdownContentConfig"},
    "quickOpen": {"$ref": "#/$defs/QuickOpenConfig"},
    "openDefaultApp": {"$ref": "#/$defs/OpenDefaultAppConfig"},
    "fulltextSearch": {"$ref": "#/$defs/FulltextSearchConfig"},
    "openInBackground": {"$ref": "#/$defs/OpenInBackgroundConfig"},
    "saveWorkspaceAndSwitchKeys": {"$ref": "#/$defs/Hotkey"}
  }
}
```


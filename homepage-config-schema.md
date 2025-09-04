# Homepage — Config + Schema

- Plugin: Homepage (`homepage`) v4.2.2
- Source: `obsidian-homepage`

## Configuration

**Homepage: Programmatic Configuration (v4.2.2)**

- **Plugin ID:** `homepage`
- **Settings File:** `<YOUR_VAULT>/.obsidian/plugins/homepage/data.json`
- **Schema:** `schema/homepage.settings.schema.json`

Overview
- Settings object contains a version, a `homepages` map keyed by homepage name, and `separateMobile` to keep mobile/desktop configurations independent.
- Each homepage entry uses `HomepageData` (see schema) to define the target (file/workspace/etc.), opening behavior, and optional commands to run.

HomepageData keys
- `value`: string; file/workspace/journal identifier depending on `kind`.
- `kind`: one of `File|Workspace|Random file|Random in folder|Graph view|Nothing|Journal|Daily Note|Weekly Note|Monthly Note|Yearly Note`.
- `openOnStartup`: boolean; run on Obsidian launch (may be disabled if Daily Notes autorun is detected).
- `openMode`: one of `Replace all open notes|Replace last note|Keep open notes`.
- `manualOpenMode`: same enum; used when opening manually.
- `view`: one of `Default view|Reading view|Editing view (Source)|Editing view (Live Preview)`.
- `revertView`: boolean; restore default view when navigating away.
- `openWhenEmpty`: boolean; open homepage when all tabs closed.
- `refreshDataview`: boolean; reload Dataview views (requires Dataview auto‑refresh).
- `autoCreate`: boolean; create the note if it does not exist.
- `autoScroll`: boolean; scroll to bottom and focus last line on open.
- `pin`: boolean; pin homepage tab.
- `commands`: array of `{ id, period }`, where `period` is `Both|Startup only|Manual only`.
- `alwaysApply`: boolean; apply homepage settings when opening the file normally.
- `hideReleaseNotes`: boolean; suppress Obsidian release notes on update.

data.json (minimal example)
```json
{
  "version": 4,
  "separateMobile": false,
  "homepages": {
    "Main Homepage": {
      "value": "Home",
      "kind": "File",
      "openOnStartup": true,
      "openMode": "Replace all open notes",
      "manualOpenMode": "Keep open notes",
      "view": "Default view",
      "revertView": true,
      "openWhenEmpty": false,
      "refreshDataview": false,
      "autoCreate": false,
      "autoScroll": false,
      "pin": false,
      "commands": [],
      "alwaysApply": false,
      "hideReleaseNotes": false
    }
  }
}
```

Source Pointers
- Types and defaults: `src/settings.ts`, `src/homepage.ts`
- Behavior/launch: `src/homepage.ts`, `src/main.ts`

## Settings Schema (JSON)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.local/obsidian-homepage/homepage.settings.schema.json",
  "title": "Homepage Settings",
  "description": "Programmatic configuration for the Homepage plugin. Based on src/settings.ts and src/homepage.ts.",
  "type": "object",
  "additionalProperties": false,
  "definitions": {
    "Period": {"enum": ["Both", "Startup only", "Manual only"]},
    "Mode": {"enum": ["Replace all open notes", "Replace last note", "Keep open notes"]},
    "View": {"enum": ["Default view", "Reading view", "Editing view (Source)", "Editing view (Live Preview)"]},
    "Kind": {"enum": [
      "File", "Workspace", "Random file", "Random in folder", "Graph view", "Nothing",
      "Journal", "Daily Note", "Weekly Note", "Monthly Note", "Yearly Note"
    ]},
    "CommandData": {
      "type": "object",
      "additionalProperties": false,
      "properties": {"id": {"type": "string"}, "period": {"$ref": "#/$defs/Period"}},
      "required": ["id", "period"]
    },
    "HomepageData": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "value": {"type": "string"},
        "kind": {"$ref": "#/$defs/Kind"},
        "openOnStartup": {"type": "boolean"},
        "openMode": {"$ref": "#/$defs/Mode"},
        "manualOpenMode": {"$ref": "#/$defs/Mode"},
        "view": {"$ref": "#/$defs/View"},
        "revertView": {"type": "boolean"},
        "openWhenEmpty": {"type": "boolean"},
        "refreshDataview": {"type": "boolean"},
        "autoCreate": {"type": "boolean"},
        "autoScroll": {"type": "boolean"},
        "pin": {"type": "boolean"},
        "commands": {"type": "array", "items": {"$ref": "#/$defs/CommandData"}},
        "alwaysApply": {"type": "boolean"},
        "hideReleaseNotes": {"type": "boolean"}
      },
      "required": ["value", "kind", "openOnStartup", "openMode", "manualOpenMode", "view", "revertView", "openWhenEmpty", "autoCreate", "pin", "commands", "alwaysApply", "hideReleaseNotes"]
    }
  },
  "properties": {
    "version": {"type": "number"},
    "homepages": {
      "type": "object",
      "description": "Map from homepage name to its configuration.",
      "additionalProperties": {"$ref": "#/$defs/HomepageData"}
    },
    "separateMobile": {"type": "boolean", "description": "Store separate homepage config for mobile devices."}
  },
  "required": ["version", "homepages", "separateMobile"]
}
```


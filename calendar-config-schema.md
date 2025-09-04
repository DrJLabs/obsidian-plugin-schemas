# Calendar — Config + Schema

- Plugin: Calendar (`calendar`) v1.5.10
- Source: `obsidian-calendar-plugin`

## Configuration

**Calendar: Programmatic Configuration (v1.5.10)**

- **Plugin ID:** `calendar`
- **Settings File:** `<YOUR_VAULT>/.obsidian/plugins/calendar/data.json`
- **Schema:** `schema/calendar.settings.schema.json`

Overview
- Settings are merged on load (`loadData()` → spread into store) and persisted on change via `saveData()`.
- Weekly note settings are shown only if `showWeeklyNote` is enabled and Periodic Notes is not detected.

Settings (defaults from `src/settings.ts`)
- `wordsPerDot` (number, default `250`): Words represented by a single dot.
- `weekStart` (enum, default `locale`): One of `locale|sunday|monday|tuesday|wednesday|thursday|friday|saturday`.
- `shouldConfirmBeforeCreate` (boolean, default `true`): Confirm before creating notes.
- `showWeeklyNote` (boolean, default `false`): Show week number column and enable weekly note options.
- `weeklyNoteFormat` (string, default `""`): Format string for weekly notes (see `DEFAULT_WEEK_FORMAT`).
- `weeklyNoteTemplate` (string, default `""`): Path of template file for weekly notes.
- `weeklyNoteFolder` (string, default `""`): Destination folder for weekly notes.
- `localeOverride` (string, default `system-default`): Moment locale override or `system-default`.

data.json (example)
```json
{
  "wordsPerDot": 200,
  "weekStart": "monday",
  "shouldConfirmBeforeCreate": true,
  "showWeeklyNote": true,
  "weeklyNoteFormat": "gggg-[W]ww",
  "weeklyNoteTemplate": "Templates/Week.md",
  "weeklyNoteFolder": "Weekly",
  "localeOverride": "system-default"
}
```

Source Pointers
- Interface and defaults: `src/settings.ts`, `src/constants.ts`
- Load/save behavior: `src/main.ts`

## Settings Schema (JSON)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.local/obsidian-calendar-plugin/calendar.settings.schema.json",
  "title": "Calendar Settings",
  "description": "Programmatic configuration for the Calendar plugin. Based on src/settings.ts.",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "wordsPerDot": {"type": "number", "default": 250},
    "weekStart": {"type": "string", "enum": ["locale", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"], "default": "locale"},
    "shouldConfirmBeforeCreate": {"type": "boolean", "default": true},
    "showWeeklyNote": {"type": "boolean", "default": false},
    "weeklyNoteFormat": {"type": "string", "default": ""},
    "weeklyNoteTemplate": {"type": "string", "default": ""},
    "weeklyNoteFolder": {"type": "string", "default": ""},
    "localeOverride": {"type": "string", "default": "system-default"}
  }
}
```


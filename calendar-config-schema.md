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

Allowed Values Summary
- `weekStart`: one of `locale`, `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`.
- `localeOverride`: typically a BCP‑47 locale (e.g., `en-US`), or `system-default` to use the OS locale.

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
    "wordsPerDot": {"type": "number", "description": "Number of words represented by a single activity dot.", "minimum": 1, "default": 250},
    "weekStart": {"type": "string", "description": "Start of week for calendar view.", "enum": ["locale", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"], "default": "locale"},
    "shouldConfirmBeforeCreate": {"type": "boolean", "description": "Show a confirmation dialog before creating daily/weekly notes.", "default": true},
    "showWeeklyNote": {"type": "boolean", "description": "Enable weekly notes UI and features.", "default": false},
    "weeklyNoteFormat": {"type": "string", "description": "Format string for weekly note titles.", "default": ""},
    "weeklyNoteTemplate": {"type": "string", "description": "Path to the template file for weekly notes.", "default": ""},
    "weeklyNoteFolder": {"type": "string", "description": "Folder where weekly notes are created.", "default": ""},
    "localeOverride": {"type": "string", "description": "Explicit locale to use (e.g., en-US), or 'system-default' to inherit OS locale.", "default": "system-default"}
  }
}
```

# Obsidian Plugin Schemas

Canonical JSON Schemas and configuration guides for popular Obsidian plugins. These schemas validate each plugin’s `data.json` and document every configurable option with defaults and constraints.

> Repo scope: generated from the plugin sources in this repository. Files live alongside each plugin under `schema/` plus a human‑friendly `CONFIGURATION.md`.

## Plugins Covered

| Plugin | ID | Version | Schema | Guide |
|---|---|---:|---|---|
| Dataview | dataview | 0.5.68 | `obsidian-dataview/schema/dataview.settings.schema.json` | `obsidian-dataview/CONFIGURATION.md` |
| Kanban | obsidian-kanban | 2.0.51 | `obsidian-kanban/schema/kanban.settings.schema.json` | `obsidian-kanban/CONFIGURATION.md` |
| Meta Bind | obsidian-meta-bind-plugin | 1.4.5 | `obsidian-meta-bind-plugin/schema/meta-bind.settings.schema.json` | `obsidian-meta-bind-plugin/CONFIGURATION.md` |
| Style Settings | obsidian-style-settings | 1.0.9 | `obsidian-style-settings/schema/style-settings.schema.json` | `obsidian-style-settings/CONFIGURATION.md` |
| Tasks | obsidian-tasks-plugin | 7.21.0 | `obsidian-tasks/schema/tasks.settings.schema.json` | `obsidian-tasks/CONFIGURATION.md` |
| QuickAdd | quickadd | 2.1.0 | `quickadd/schema/quickadd.settings.schema.json` | `quickadd/CONFIGURATION.md` |
| Templater | templater-obsidian | 2.14.1 | `Templater/schema/templater.settings.schema.json` | `Templater/CONFIGURATION.md` |
| Age Encrypt | age-encrypt | 1.2.0 | `obsidian-age-encrypt/schema/age-encrypt.settings.schema.json` | `obsidian-age-encrypt/CONFIGURATION.md` |
| Copilot | copilot | 3.0.2 | `obsidian-copilot/schema/copilot.settings.schema.json` | `obsidian-copilot/CONFIGURATION.md` |
| Calendar | calendar | 1.5.10 | `obsidian-calendar-plugin/schema/calendar.settings.schema.json` | `obsidian-calendar-plugin/CONFIGURATION.md` |

## Usage
- Validate a plugin settings file: point your JSON tooling at the matching schema path.
- Provision programmatically: generate the plugin’s `data.json` from the schema, then place it at `<vault>/.obsidian/plugins/<plugin-id>/data.json`.

## Contributing
- Edit schemas under each plugin’s `schema/` folder.
- Keep `CONFIGURATION.md` source‑aligned; derive values from code, not docs.
- Conventional Commits. Subjects ≤72 chars.

## License
- Schemas and guides are derived from plugin code under their respective licenses. This repo does not relicense upstream plugins; it only ships derived schemas and documentation.

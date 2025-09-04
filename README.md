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
| Homepage | homepage | 4.2.2 | `obsidian-homepage/schema/homepage.settings.schema.json` | `obsidian-homepage/CONFIGURATION.md` |
| Editing Toolbar | editing-toolbar | 3.1.18 | `obsidian-editing-toolbar/schema/editing-toolbar.settings.schema.json` | `obsidian-editing-toolbar/CONFIGURATION.md` |
| Commander | cmdr | 0.5.4 | `obsidian-commander/schema/commander.settings.schema.json` | `obsidian-commander/CONFIGURATION.md` |
| Quick Switcher++ | darlal-switcher-plus | 5.3.1 | `obsidian-switcher-plus/schema/switcher-plus.settings.schema.json` | `obsidian-switcher-plus/CONFIGURATION.md` |
| Local REST API | obsidian-local-rest-api | 3.2.0 | `local-rest-api-config-schema.md` | `local-rest-api-config-schema.md` |

## Combined Config + Schema Bundles

Self‑contained files for AI agents or provisioning scripts. Each includes a short configuration guide and the full JSON Schema.

- Homepage: `homepage-config-schema.md`
- Quick Switcher++: `switcher-plus-config-schema.md`
- Calendar: `calendar-config-schema.md`
- Meta Bind: `meta-bind-config-schema.md`
- Copilot: `copilot-config-schema.md`
- Style Settings: `style-settings-config-schema.md`
- Templater: `templater-config-schema.md`
- Dataview: `dataview-config-schema.md`
- QuickAdd: `quickadd-config-schema.md`
- Editing Toolbar: `editing-toolbar-config-schema.md`
- Tasks: `tasks-config-schema.md`
- Commander: `commander-config-schema.md`
- Kanban: `kanban-config-schema.md`
- Age Encrypt: `age-encrypt-config-schema.md`
- Local REST API: `local-rest-api-config-schema.md`

## Usage
- Validate a plugin settings file: point your JSON tooling at the matching schema path.
- Provision programmatically: generate the plugin’s `data.json` from the schema, then place it at `<vault>/.obsidian/plugins/<plugin-id>/data.json`.

## Contributing
- Edit schemas under each plugin’s `schema/` folder.
- Keep `CONFIGURATION.md` source‑aligned; derive values from code, not docs.
- Conventional Commits. Subjects ≤72 chars.

## License
- Schemas and guides are derived from plugin code under their respective licenses. This repo does not relicense upstream plugins; it only ships derived schemas and documentation.

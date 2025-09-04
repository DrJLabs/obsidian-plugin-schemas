# Local REST API — Config + Schema

- Plugin: Local REST API (`obsidian-local-rest-api`) v3.2.0
- Source: `obsidian-local-rest-api`

## Configuration

**Local REST API: Programmatic Configuration (v3.2.0)**

- **Plugin ID:** `obsidian-local-rest-api`
- **Settings File:** `<YOUR_VAULT>/.obsidian/plugins/obsidian-local-rest-api/data.json`
- **Schema:** `schema/local-rest-api.settings.schema.json`

Overview
- Exposes a local REST API for Obsidian to read/create/update/delete notes, list notes, work with periodic notes, and execute commands.
- Provides a secure HTTPS server (default on) and an optional HTTP server (default off). Authentication via API key.

Security Notes
- Keep the API bound to `127.0.0.1` and do not expose it to the internet.
- Prefer HTTPS. Only enable the HTTP server (`enableInsecureServer`) in trusted environments.
- Certificates are self-generated. You can re-generate or reset via settings if needed.

Key Defaults (source‑derived)
- `port`: 27124 (HTTPS)
- `insecurePort`: 27123 (HTTP)
- `enableSecureServer`: true (default via code)
- `enableInsecureServer`: false
- `authorizationHeaderName`: `Authorization`
- `bindingHost`: `127.0.0.1`
- `apiKey`: auto-generated on first run if missing/empty
- `crypto`: auto-generated on first run if missing

data.json (minimal example)
```json
{
  "port": 27124,
  "insecurePort": 27123,
  "enableInsecureServer": false,
  "enableSecureServer": true,
  "authorizationHeaderName": "Authorization",
  "bindingHost": "127.0.0.1",
  "subjectAltNames": ""
}
```

Notes
- Omitting `apiKey` and `crypto` will cause the plugin to generate secure defaults on first run.
- `subjectAltNames` is a newline-separated string of hostnames to include in the certificate. Re-generate certificates after changes.
- To change the Authorization header name, set `authorizationHeaderName`; leave as default for typical clients.

Provisioning Steps
- Write `data.json` following the schema below.
- Load Obsidian; the plugin will generate `apiKey` and `crypto` if absent.
- If you adjusted certificate-related fields, re-generate certificates from the plugin settings UI.

Source Pointers
- Types & settings: `src/types.ts`, `src/constants.ts`
- Settings UI & server control: `src/main.ts`
- Request handling & routes: `src/requestHandler.ts`

## Settings Schema (JSON)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.local/obsidian-local-rest-api/local-rest-api.settings.schema.json",
  "title": "Local REST API Settings",
  "description": "Programmatic configuration for the obsidian-local-rest-api plugin (data.json). Based on src/types.ts and src/constants.ts.",
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "apiKey": {
      "type": "string",
      "description": "API key used for bearer-token authentication. Leave empty/omit to auto-generate on first run.",
      "default": ""
    },
    "crypto": {
      "type": "object",
      "description": "TLS certificate and keys. Omit to auto-generate self-signed certs on first run.",
      "additionalProperties": false,
      "properties": {
        "cert": {"type": "string"},
        "privateKey": {"type": "string"},
        "publicKey": {"type": "string"}
      }
    },
    "port": {
      "type": "integer",
      "minimum": 1,
      "maximum": 65535,
      "default": 27124,
      "description": "HTTPS server port."
    },
    "insecurePort": {
      "type": "integer",
      "minimum": 1,
      "maximum": 65535,
      "default": 27123,
      "description": "HTTP server port (used only if enableInsecureServer=true)."
    },
    "enableInsecureServer": {
      "type": "boolean",
      "default": false,
      "description": "Enable non-encrypted HTTP server (NOT recommended)."
    },
    "enableSecureServer": {
      "type": "boolean",
      "default": true,
      "description": "Enable HTTPS server."
    },
    "authorizationHeaderName": {
      "type": "string",
      "default": "Authorization",
      "description": "Header name used for bearer token."
    },
    "bindingHost": {
      "type": "string",
      "default": "127.0.0.1",
      "description": "Binding host/IP for servers."
    },
    "subjectAltNames": {
      "type": "string",
      "default": "",
      "description": "Optional newline-separated hostnames to include in certificate subjectAltName."
    }
  }
}
```


# Copilot — Config + Schema

- Plugin: Copilot (`copilot`) v3.0.2
- Source: `obsidian-copilot`

## Configuration

**Copilot: Programmatic Configuration (v3.0.2)**

- **Plugin ID:** `copilot`
- **Settings File:** `<YOUR_VAULT>/.obsidian/plugins/copilot/data.json`
- **Schema:** `schema/copilot.settings.schema.json`

Overview
- Copilot stores a large settings object (see `src/constants.ts` DEFAULT_SETTINGS and `src/settings/model.ts`). On load it calls `sanitizeSettings()` to coerce types, clamp ranges, and backfill defaults, then keeps settings in a Jotai store. Saves use `saveData()` and may pass through `encryptAllKeys()` if `enableEncryption` is enabled.
- Sensitive fields (API keys and per‑model `apiKey`) can be encrypted at rest on desktop (Electron safeStorage) or via WebCrypto in browsers when `enableEncryption` is true.

Key Domains
- API keys: `openAIApiKey`, `anthropicApiKey`, `googleApiKey`, `openRouterAiApiKey`, `xaiApiKey`, `mistralApiKey`, `deepseekApiKey`, `azureOpenAIApiKey`, etc. Optional per‑model `apiKey` in `activeModels[]` and `activeEmbeddingModels[]`.
- Models: `defaultModelKey` and `embeddingModelKey` identify selected models (format: `name|provider`). `activeModels[]` and `activeEmbeddingModels[]` list available models with enable flags and optional tuning.
- Behavior: `temperature`, `maxTokens`, `contextTurns`, `stream`, `includeActiveNoteAsContext`, `allowAdditionalContext`, `enableAutocomplete`, `autocompleteAcceptKey`, `enableWordCompletion`.
- Indexing/Search: `indexVaultToVectorStore`, `enableIndexSync`, `disableIndexOnMobile`, `embeddingRequestsPerMin`, `embeddingBatchSize`, `lexicalSearchRamLimit` (20–1000 MB), `enableSemanticSearchV3`, `enableLexicalBoosts`.
- Chat UX: `defaultSaveFolder`, `defaultConversationTag`, `autosaveChat`, `defaultOpenArea` (`editor` or `view`), `defaultConversationNoteName`, `showSuggestedPrompts`, `showRelevantNotes`.
- Agent: `enableAutonomousAgent`, `autonomousAgentMaxIterations` (4–8), `autonomousAgentEnabledToolIds`.
- Projects: `projectList[]` contains project configs with model overrides and context sources.

Security Notes
- Set `enableEncryption: true` to encrypt keys before saving. Desktop uses Electron safe storage; otherwise falls back to WebCrypto (see `src/encryptionService.ts`).
- Do not commit populated `data.json` with real secrets.

data.json (minimal scaffold)
```json
{
  "defaultModelKey": "gpt-4o|openai",
  "embeddingModelKey": "text-embedding-3-small|openai",
  "temperature": 0.7,
  "maxTokens": 2000,
  "includeActiveNoteAsContext": true,
  "enableEncryption": true,
  "activeModels": [],
  "activeEmbeddingModels": []
}
```

Provisioning Steps
- Place `data.json` at the path above. Restart the plugin to load.
- To pre‑seed models, provide entries in `activeModels[]`/`activeEmbeddingModels[]`. Use `name|provider` in `defaultModelKey`/`embeddingModelKey`.
- For large vaults, tune `embeddingRequestsPerMin`, `embeddingBatchSize`, and `lexicalSearchRamLimit`.

Source Pointers
- Defaults and enums: `src/constants.ts`
- Settings shape and sanitizer: `src/settings/model.ts`
- Key encryption: `src/encryptionService.ts`

Allowed Values Summary
- `defaultChainType`: `llm_chain`, `vault_qa`, `copilot_plus`, `project`.
- `defaultOpenArea`: `editor` or `view`.
- `indexVaultToVectorStore`: `NEVER`, `ON STARTUP`, `ON MODE SWITCH`.
- `reasoningEffort`: `minimal`, `low`, `medium`, `high`.
- `verbosity`: `low`, `medium`, `high`.

## Settings Schema (JSON)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.local/obsidian-copilot/copilot.settings.schema.json",
  "title": "Copilot Settings",
  "description": "Programmatic configuration for the Copilot plugin. Based on src/constants.ts and src/settings/model.ts. Sensitive keys may be encrypted at rest when enableEncryption=true.",
  "type": "object",
  "additionalProperties": true,
  "$defs": {
    "CustomModel": {
      "type": "object",
      "additionalProperties": true,
      "properties": {
        "name": {"type": "string"},
        "provider": {"type": "string"},
        "baseUrl": {"type": "string"},
        "apiKey": {"type": "string", "description": "May be stored encrypted depending on platform and enableEncryption"},
        "enabled": {"type": "boolean"},
        "isEmbeddingModel": {"type": "boolean"},
        "isBuiltIn": {"type": "boolean"},
        "enableCors": {"type": "boolean"},
        "core": {"type": "boolean"},
        "stream": {"type": "boolean"},
        "temperature": {"type": "number"},
        "maxTokens": {"type": "number"},
        "maxCompletionTokens": {"type": "number"},
        "maxRetries": {"type": "number"},
        "maxConcurrency": {"type": "number"},
        "openAIOrgId": {"type": "string"},
        "azureOpenAIApiInstanceName": {"type": "string"},
        "azureOpenAIApiDeploymentName": {"type": "string"},
        "azureOpenAIApiVersion": {"type": "string"},
        "azureOpenAIApiEmbeddingDeploymentName": {"type": "string"},
        "dimensions": {"type": "number"},
        "displayName": {"type": "string"},
        "capabilities": {"type": "array", "items": {"type": "string"}},
        "reasoningEffort": {"type": "string", "description": "Model reasoning budget (if provider supports it).", "enum": ["minimal", "low", "medium", "high"]},
        "verbosity": {"type": "string", "description": "Model output verbosity preference.", "enum": ["low", "medium", "high"]}
      },
      "required": ["name", "provider", "enabled"]
    },
    "ProjectConfig": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "id": {"type": "string"},
        "name": {"type": "string"},
        "description": {"type": "string"},
        "systemPrompt": {"type": "string"},
        "projectModelKey": {"type": "string"},
        "modelConfigs": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "temperature": {"type": "number"},
            "maxTokens": {"type": "number"}
          }
        },
        "contextSource": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "inclusions": {"type": "string"},
            "exclusions": {"type": "string"},
            "webUrls": {"type": "string"},
            "youtubeUrls": {"type": "string"}
          }
        },
        "created": {"type": "number"},
        "UsageTimestamps": {"type": "number"}
      },
      "required": ["id", "name", "systemPrompt", "projectModelKey", "created", "UsageTimestamps"]
    }
  },
  "properties": {
    "userId": {"type": "string"},
    "isPlusUser": {"type": ["boolean", "null"], "description": "undefined/null means not checked yet"},
    "plusLicenseKey": {"type": "string"},
    "openAIApiKey": {"type": "string"},
    "openAIOrgId": {"type": "string"},
    "huggingfaceApiKey": {"type": "string"},
    "cohereApiKey": {"type": "string"},
    "anthropicApiKey": {"type": "string"},
    "azureOpenAIApiKey": {"type": "string"},
    "azureOpenAIApiInstanceName": {"type": "string"},
    "azureOpenAIApiDeploymentName": {"type": "string"},
    "azureOpenAIApiVersion": {"type": "string"},
    "azureOpenAIApiEmbeddingDeploymentName": {"type": "string"},
    "googleApiKey": {"type": "string"},
    "openRouterAiApiKey": {"type": "string"},
    "xaiApiKey": {"type": "string"},
    "mistralApiKey": {"type": "string"},
    "deepseekApiKey": {"type": "string"},
    "defaultChainType": {"type": "string", "description": "Default chain type used when creating a new chat.", "enum": ["llm_chain", "vault_qa", "copilot_plus", "project"]},
    "defaultModelKey": {"type": "string"},
    "embeddingModelKey": {"type": "string"},
    "temperature": {"type": "number"},
    "maxTokens": {"type": "number"},
    "contextTurns": {"type": "number"},
    "userSystemPrompt": {"type": "string"},
    "openAIProxyBaseUrl": {"type": "string"},
    "openAIEmbeddingProxyBaseUrl": {"type": "string"},
    "stream": {"type": "boolean"},
    "defaultSaveFolder": {"type": "string"},
    "defaultConversationTag": {"type": "string"},
    "autosaveChat": {"type": "boolean"},
    "includeActiveNoteAsContext": {"type": "boolean"},
    "defaultOpenArea": {"type": "string", "description": "Where to open the Copilot UI by default.", "enum": ["editor", "view"]},
    "customPromptsFolder": {"type": "string"},
    "indexVaultToVectorStore": {"type": "string", "description": "When to index the vault into the vector store.", "enum": ["NEVER", "ON STARTUP", "ON MODE SWITCH"]},
    "qaExclusions": {"type": "string"},
    "qaInclusions": {"type": "string"},
    "chatNoteContextPath": {"type": "string"},
    "chatNoteContextTags": {"type": "array", "items": {"type": "string"}},
    "enableIndexSync": {"type": "boolean"},
    "debug": {"type": "boolean"},
    "enableEncryption": {"type": "boolean", "description": "Encrypts API keys before saving settings (desktop via Electron safeStorage, otherwise WebCrypto)."},
    "maxSourceChunks": {"type": "number"},
    "groqApiKey": {"type": "string"},
    "activeModels": {"type": "array", "items": {"$ref": "#/$defs/CustomModel"}},
    "activeEmbeddingModels": {"type": "array", "items": {"$ref": "#/$defs/CustomModel"}},
    "embeddingRequestsPerMin": {"type": "number"},
    "embeddingBatchSize": {"type": "number"},
    "disableIndexOnMobile": {"type": "boolean"},
    "showSuggestedPrompts": {"type": "boolean"},
    "showRelevantNotes": {"type": "boolean"},
    "numPartitions": {"type": "number"},
    "lexicalSearchRamLimit": {"type": "number", "description": "RAM limit for lexical search in MB.", "minimum": 20, "maximum": 1000},
    "promptUsageTimestamps": {"type": "object", "additionalProperties": {"type": "number"}},
    "promptSortStrategy": {"type": "string"},
    "defaultConversationNoteName": {"type": "string"},
    "inlineEditCommands": {"type": "array", "items": {"type": "object"}},
    "projectList": {"type": "array", "items": {"$ref": "#/$defs/ProjectConfig"}},
    "enableAutocomplete": {"type": "boolean"},
    "autocompleteAcceptKey": {"type": "string"},
    "allowAdditionalContext": {"type": "boolean"},
    "enableWordCompletion": {"type": "boolean"},
    "lastDismissedVersion": {"type": ["string", "null"]},
    "passMarkdownImages": {"type": "boolean"},
    "enableAutonomousAgent": {"type": "boolean"},
    "enableCustomPromptTemplating": {"type": "boolean"},
    "enableSemanticSearchV3": {"type": "boolean"},
    "enableLexicalBoosts": {"type": "boolean"},
    "suggestedDefaultCommands": {"type": "boolean"},
    "autonomousAgentMaxIterations": {"type": "number", "description": "Max steps the autonomous agent may take per run.", "minimum": 4, "maximum": 8},
    "autonomousAgentEnabledToolIds": {"type": "array", "items": {"type": "string"}},
    "reasoningEffort": {"type": "string", "description": "Model reasoning budget (if provider supports it).", "enum": ["minimal", "low", "medium", "high"]},
    "verbosity": {"type": "string", "description": "Model output verbosity preference.", "enum": ["low", "medium", "high"]}
  }
}
```

# AGENTS.md · MCP instructions

## Mission
Follow these routing rules. Use exactly one mapped MCP server per subtask. Print a short **Tool Plan** before the first call and update it when plans change.

## Preflight
- Enumerate each server: call `tools/list`, `resources/list`, `prompts/list`. Stop with one-line reason if a required server is absent. 
- Output a **Tool Plan** mapping each subtask to one server and why. 
- Use stdio transports. For SSE servers, route through the configured proxy only.

## Git & Workstyle
- One branch per worktree under a dedicated root. Keep control checkout clean.
- Branch names: `feat/<kebab>`, `fix/<kebab>`, `chore/<kebab>`.
- Conventional Commits. Subjects ≤72 chars.

## Review & Validation
- If linters or tests exist, run them before PR. If missing, create a minimal smoke check and document steps.
- CI and scripted browser checks must run via `playwright-headless`.

## File Hygiene
- Never commit secrets, tokens, or machine paths. Use env vars or local config.
- Respect `.gitignore`. Maintain `.env.example` patterns.

## Routing map (server names match config.toml)
- `brave-search` → web, news, image, or site-scoped search tasks.
- `playwright-headless` → automated browser tasks: CI, scraping, screenshots, perf checks.
- `playwright` → interactive debug only when a human requests it.
- `Context7` → any technical task that benefits from up-to-date docs: libraries, CLIs, APIs, cloud services, standards, OS tools. Prefer version-matched docs.
- `code_index` → semantic codebase understanding when explicitly needed by triggers below.
- `github` → branches, PRs, labels, reviews, and status checks.
- `openmemory` (via `mcp-proxy`) → persist durable decisions, constraints, preferences. Do not store secrets.

## Web research policy
- Prefer the native web_search tool for browsing when allowed.
- The ban on `curl` and `fetch` applies **only to web-search tasks**. For API integration or validation you MAY use `curl` or HTTP clients. Redact secrets.

## Browser automation modes (mutually exclusive per run)
- Automated mode: use `playwright-headless` with isolated context. Save artifacts to `~/.cache/playwright-mcp`. 
- Interactive debug mode: use `playwright`. Keep sessions short: open → act → screenshot/logs → close.
- Never authenticate with real credentials or upload secrets. Always capture a screenshot on failure states.

## Context7 doc-first mode
- When implementing, configuring, or diagnosing anything that depends on technical documentation, call `Context7` to fetch current, version-matched docs and examples. Quote doc source and version in PRs and commit bodies.

## Code-Index gating and usage
- Default: **do not index**.
- Index only if any trigger is true:
  1) Another tool’s results recommend indexing or require cross-file context.
  2) Major or multiple file changes have occurred since last index.
- Decision steps:
  - Check last index metadata if available. 
  - If needed and no path set, call `set_project_path` once per session.
  - Use `find_files`, `search_code_advanced` with tight `file_pattern` and `context_lines ≤ 2` by default.
  - Call `refresh_index` only when the watcher is stale or after major changes.
  - Avoid regex unless necessary.

## GitHub via MCP
- Read-first: list/get before create/update/delete.
- Flow: `create_branch` → modify → `create_pull_request`. Prefer PR over direct push to protected branches.
- Reviews: `create_pending_pull_request_review` → add comments → submit review.
- Avoid destructive tools (`delete_file`, `merge_pull_request`, workflow reruns) without explicit human approval.
- For remote or cross‑repo code search, use GitHub search. Prefer local `code_index` for in-repo semantic tasks.

## OpenMemory usage
- At task start, `search_memory` for prior context.
- Persist durable decisions, constraints, user preferences, and project architecture via `add_memories`.
- Use `list_memories` sparingly. Never call `delete_all_memories` unless explicitly instructed.

## Security
- Treat env vars such as `BRAVE_API_KEY` as secrets. Never print them or store them in memory.
- Use only the mapped MCP servers. Do not bypass MCP for web search.

## Failure handling
- Each MCP call: ≤2 retries with exponential backoff. On final failure, print tool name, args shape, and last error, then propose a fallback or request guidance.

## Approval gates
- Before the first external web call: print the **Tool Plan**.
- Before opening or merging a PR: print a **Change Summary** with files touched, test results, and linked artifacts.

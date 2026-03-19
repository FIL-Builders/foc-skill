---
name: foc-docs
description: Search and fetch Filecoin Onchain Cloud documentation efficiently. Use when looking up Synapse SDK APIs, storage guides, payment operations, PDP concepts, or any FOC reference material. Triggers on "docs", "documentation", "how to", "guide", "reference", "API", "Synapse SDK docs".
---

# foc-docs — Documentation Search

Fast, filtered access to **Filecoin Onchain Cloud** docs via `foc-skill docs`.

## Install

```bash
npm install -g foc-skill
# or
npx foc-skill --help
```

## How It Works

The `docs` command searches a curated index of ~28 high-level doc pages (filtered from 1300+ raw entries). When your search narrows to 1-3 matches, it **auto-fetches** the top result — giving you content in a single call.

## foc-skill docs

Fetch Filecoin Onchain Cloud documentation. Search the index with --prompt, or fetch a specific page with --url. Content is filtered to reduce size.

### Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--prompt` | `string` |  | What you're looking for — searches the docs index and returns matched entries. If only 1-3 matches, auto-fetches the top result. |
| `--url` | `string` |  | Fetch a specific documentation URL (e.g. from the index results) |
| `--maxDepth` | `number` | `4` | Maximum header depth to include. Use 6 for full detail, 2 for high-level overview only. |
| `--debug` | `boolean` |  | Enable debug mode |

### Output

| Field | Type | Description |
|-------|------|-------------|
| `source` | `string` | URL of the fetched content |
| `content` | `string` | Filtered markdown content |
| `matchedEntries` | `array` | Matched index entries (title, url, description, section) |

### Examples

```sh
# Search by topic — auto-fetches if few matches
foc-skill docs --prompt "upload files"
foc-skill docs --prompt "split operations"
foc-skill docs --prompt "payments"

# Fetch a specific doc page (filtered to #### depth)
foc-skill docs --url https://docs.filecoin.cloud/developer-guides/storage/storage-operations.md

# Fetch with full detail (all header depths)
foc-skill docs --url https://docs.filecoin.cloud/developer-guides/storage/storage-operations.md --maxDepth 6

# Browse the full docs index
foc-skill docs
```

## Usage Patterns

### Search by topic (recommended first step)

```bash
foc-skill docs --prompt "split operations"    # auto-fetches the page
foc-skill docs --prompt "payments"            # fetches Payment Operations
foc-skill docs --prompt "upload files"        # fetches Storage Operations
```

When `--prompt` matches **1-3 entries**: auto-fetches the top result + shows other matches as CTAs.
When `--prompt` matches **4+ entries**: returns a compact entry list with URLs to fetch.

### Fetch a specific page

```bash
foc-skill docs --url https://docs.filecoin.cloud/developer-guides/storage/storage-operations.md
```

Pages are filtered to `####` depth by default (strips deep API sub-sections).

### Control detail level

```bash
foc-skill docs --url <url> --maxDepth 6    # full detail (all headers)
foc-skill docs --url <url> --maxDepth 2    # high-level overview only
```

## Doc Map

| Topic | Prompt | Direct URL |
|-------|--------|-----------|
| Upload files | `"upload"` or `"storage operations"` | `storage/storage-operations.md` |
| Split upload (manual control) | `"split operations"` | `storage/storage-context.md` |
| Storage costs | `"costs"` or `"pricing"` | `storage/storage-costs.md` |
| Payments & deposits | `"payments"` | `payments/payment-operations.md` |
| Payment rails | `"rails"` or `"settlement"` | `payments/rails-settlement.md` |
| Session keys | `"session keys"` | `session-keys.md` |
| Quick start | `"getting started"` | `getting-started.md` |
| Architecture | `"architecture"` | `core-concepts/architecture.md` |
| PDP proofs | `"PDP"` or `"proof"` | `core-concepts/pdp-overview.md` |
| React hooks | `"react"` | `react-integration.md` |
| Synapse Core (low-level) | `"synapse core"` | `synapse-core.md` |
| Devnet | `"devnet"` | `devnet.md` |

All URLs are relative to `https://docs.filecoin.cloud/developer-guides/`.

## MCP Tool

Available as `mcp__foc-skill__docs` with options: `prompt`, `url`, `maxDepth`, `debug`.

## Tips

- Start with `--prompt` — it usually gets you there in 1 call
- Use the CTA suggestions in results to navigate related pages
- For API reference details, re-fetch with `--maxDepth 6`
- The index is sourced from `https://docs.filecoin.cloud/llms.txt`

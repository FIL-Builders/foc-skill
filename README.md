# foc-skill

CLI and AI agent skill for **Filecoin Onchain Cloud (FOC)** — decentralized storage on Filecoin with PDP verification and USDFC payments.

Built with [incur](https://github.com/wevm/incur) for seamless use by both humans and AI agents (MCP, skills, structured output).

## Install

```bash
npm install -g foc-skill
```

Or run directly:

```bash
npx foc-skill --help
```

## Install as AI Agent Skill

Add foc-skill to your AI coding agent using [skills.sh](https://skills.sh):

```bash
npx skills add FIL-Builders/foc-skill
```

This installs the skill for Claude Code, Cursor, Copilot, Codex, Windsurf, and 20+ other AI tools.

Or register as an MCP server for direct tool access:

```bash
foc-skill mcp add                    # Auto-detect your agent
foc-skill mcp add --agent claude-code  # Specific agent
```

## Skills

This package ships three focused skills for AI agents:

| Skill | When to use |
|-------|-------------|
| **foc-skill** | General overview — what is FOC, architecture, installation, all commands at a glance. Start here when you're new. |
| **foc-ops** | Executing storage operations — uploading files, managing wallets/payments, datasets, pieces, and providers. Use when you need to **do** something. |
| **foc-docs** | Searching FOC documentation — find guides, SDK references, and concept explainers. Use when you need to **learn** something. |

### foc-skill (overview)

The main skill. Covers what Filecoin Onchain Cloud is, the four-layer architecture (Storage, Verification, Settlement, Developer), pricing, setup, and a complete command reference. Best as your entry point.

### foc-ops (operations)

All operational commands with full argument/option schemas from incur's `--llms-full` manifest. Covers:

- **upload / multi-upload** — file storage with copies and CDN
- **wallet** — init, balance, fund, deposit, withdraw, summary, costs
- **dataset** — create, list, details, upload, terminate
- **piece** — list, remove
- **provider** — list approved PDP providers

Use this skill when you need to execute commands, understand their arguments, or build automation.

### foc-docs (documentation)

The `docs` command with usage patterns, the doc map (topic-to-URL lookup table), and tips for getting content in 1 call. Use this skill when you need to look up Synapse SDK APIs, storage guides, payment operations, or any FOC reference material.

## Quick Start

```bash
# 1. Initialize wallet
foc-skill wallet init --auto

# 2. Get testnet tokens
foc-skill wallet fund

# 3. Deposit USDFC for storage payments
foc-skill wallet deposit 1

# 4. Upload a file
foc-skill upload ./myfile.pdf
```

## What is Filecoin Onchain Cloud?

FOC transforms Filecoin from cold archive storage into a **programmable cloud service layer**:

- **Warm Storage** (FWSS) — fast, retrievable, PDP-verified data storage
- **Proof of Data Possession** (PDP) — cryptographic proof providers still hold your data
- **Filecoin Pay** — programmable onchain payments in USDFC
- **Synapse SDK** — TypeScript APIs for storage, payments, and retrieval

**Pricing:** $2.5/TiB/month/copy (min 2 copies). Minimum 0.06 USDFC/month (~24 GiB).

## Commands

Every command supports `-h` / `--help` for full usage details.

### Upload

```bash
foc-skill upload <path>                      # Auto provider/dataset selection
foc-skill upload <path> --withCDN --copies 3 # CDN + 3 copies
foc-skill multi-upload ./a.pdf,./b.pdf       # Batch upload
```

### Wallet & Payments

```bash
foc-skill wallet init [--auto|--keystore <path>|--privateKey <key>]
foc-skill wallet balance           # FIL/USDFC balances
foc-skill wallet fund              # Testnet faucet
foc-skill wallet deposit <amount>  # Deposit USDFC
foc-skill wallet withdraw <amount> # Withdraw USDFC
foc-skill wallet summary           # Funding timeline & rates
foc-skill wallet costs --extraBytes <n> --extraRunway <months>
```

### Datasets

```bash
foc-skill dataset list                       # List all datasets
foc-skill dataset details -d <id>            # Dataset metadata + pieces
foc-skill dataset create [providerId] [--cdn] # Create dataset
foc-skill dataset upload <path> <providerId>  # Create + upload
foc-skill dataset terminate <dataSetId>       # Terminate dataset
```

### Pieces

```bash
foc-skill piece list <dataSetId>             # List pieces
foc-skill piece remove <dataSetId> <pieceId> # Remove piece
```

### Providers

```bash
foc-skill provider list             # Approved PDP providers + performance
```

### Documentation

```bash
foc-skill docs                                          # Browse docs index
foc-skill docs --prompt "how to upload files"           # Search for relevant pages
foc-skill docs --url https://docs.filecoin.cloud/getting-started  # Fetch specific page
```

### Global Options

| Option                | Default  | Description                                    |
| --------------------- | -------- | ---------------------------------------------- |
| `--chain <id>` / `-c` | `314159` | Chain ID (`314159` = testnet, `314` = mainnet) |
| `--debug`             | `false`  | Verbose error logging                          |
| `--format <fmt>`      | `toon`   | Output: `toon`, `json`, `yaml`, `md`           |
| `--json`              |          | Shorthand for `--format json`                  |

## Agent Features

foc-skill is built with [incur](https://github.com/wevm/incur), providing:

- **MCP Server** — all commands exposed as MCP tools (`foc-skill --mcp`)
- **Structured Output** — `--json`, `--format yaml`, `--filter-output`, `--token-count`
- **Schema Introspection** — `foc-skill <command> --schema` for JSON Schema of args/options/output
- **LLM Manifest** — `foc-skill --llms` for machine-readable command docs
- **TTY Awareness** — interactive prompts for humans, structured envelopes for agents

## Mainnet Usage

All commands default to Calibration testnet. Use `--chain 314` for mainnet:

```bash
foc-skill upload ./data.bin --chain 314
foc-skill wallet balance --chain 314
```

## Documentation

- [FOC Docs](https://docs.filecoin.cloud)
- [LLM-friendly docs](https://docs.filecoin.cloud/llms.txt)
- [Synapse SDK](https://github.com/FilOzone/synapse-sdk)
- [PDP Overview](https://docs.filecoin.cloud/core-concepts/pdp-overview/)
- [Filecoin Pay](https://docs.filecoin.cloud/core-concepts/filecoin-pay-overview/)
- [Warm Storage](https://docs.filecoin.cloud/core-concepts/fwss-overview/)

## License

Apache-2.0 OR MIT

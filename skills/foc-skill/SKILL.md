---
name: foc-skill
description: Use when working with Filecoin Onchain Cloud, the foc-skill CLI, Synapse SDK, storing files on Filecoin, PDP datasets, USDFC payments, or any decentralized cloud storage task on Filecoin. Triggers on "foc", "filecoin cloud", "synapse", "warm storage", "PDP", "USDFC", "foc-skill".
---

# foc-skill CLI

CLI tool built on the Synapse SDK for interacting with **Filecoin Onchain Cloud (FOC)** — a programmable, verifiable decentralized cloud built on the Filecoin network.

## What is Filecoin Onchain Cloud?

FOC transforms Filecoin from cold storage into a **programmable cloud service layer** with four layers:

| Layer        | Component                            | Purpose                                            |
| ------------ | ------------------------------------ | -------------------------------------------------- |
| Storage      | Filecoin Warm Storage Service (FWSS) | Fast, retrievable, PDP-verified data storage       |
| Verification | Proof of Data Possession (PDP)       | Cryptographic proof providers still hold your data |
| Settlement   | Filecoin Pay                         | Programmable onchain payments in USDFC/ERC-20      |
| Developer    | Synapse SDK                          | TypeScript APIs for storage, payments, retrieval   |

**Pricing:** $2.5/TiB/month/copy (min 2 copies), minimum 0.06 USDFC/month (~24 GiB). All payments settled via Filecoin Pay in USDFC.

**Core data model:** Files become **Pieces** (identified by CID), grouped into **Data Sets** stored by PDP providers, with **Payment Rails** streaming tokens from client to provider.

## Installation & Setup

```bash
# Install globally
npm install -g foc-skill

# Or run directly with npx
npx foc-skill --help

# Initialize wallet
foc-skill wallet init              # Interactive key entry
foc-skill wallet init --auto       # Generate random key
foc-skill wallet init --keystore <path>  # Use Foundry keystore
```

Config stored at platform-specific location via `conf` library (macOS: `~/Library/Preferences/foc-skill/`).

## Self-Documenting Commands

Every command and subcommand supports the `-h` / `--help` flag for detailed usage, arguments, options, and examples:

```bash
foc-skill --help                    # Top-level help with all commands
foc-skill wallet --help             # All wallet subcommands
foc-skill wallet init -h            # init arguments and options
foc-skill upload -h                 # Upload arguments, options, and examples
foc-skill dataset details -h        # Dataset details options
```

Always use `-h` on any command to discover its full interface — arguments, options with types/defaults, aliases, and examples.

## MCP Integration

Register foc-skill as an MCP server for your AI agent:

```bash
foc-skill mcp add                    # Auto-detect agent (Claude Code, Cursor, etc.)
foc-skill mcp add --agent claude-code  # Specific agent
foc-skill mcp add --no-global        # Project-local only
```

All commands are exposed as MCP tools with structured input/output schemas. Tool names use underscores: `wallet_init`, `wallet_balance`, `dataset_list`, etc.

Start MCP server manually (stdio):

```bash
foc-skill --mcp
```

## Command Reference

### Global Options

All commands accept:

| Option                | Default  | Description                                               |
| --------------------- | -------- | --------------------------------------------------------- |
| `--chain <id>` / `-c` | `314159` | Chain ID. `314159` = Calibration testnet, `314` = Mainnet |
| `--debug`             | `false`  | Verbose error logging with stack traces                   |
| `--format <fmt>`      | `toon`   | Output format: `toon`, `json`, `yaml`, `md`               |
| `--json`              |          | Shorthand for `--format json`                             |
| `-h` / `--help`       |          | Show help for any command                                 |

### `foc-skill wallet` — Wallet & Payments

| Command                                                       | Description                                                                |
| ------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `wallet init [--auto\|--keystore <path>\|--privateKey <key>]` | Initialize wallet with private key, keystore, or auto-generate             |
| `wallet balance`                                              | Check FIL/USDFC balances and payment account info                          |
| `wallet fund`                                                 | Request testnet FIL + USDFC from faucet (testnet only)                     |
| `wallet deposit <amount>`                                     | Deposit USDFC into payment account (uses permit approvals)                 |
| `wallet withdraw <amount>`                                    | Withdraw USDFC from payment account to wallet                              |
| `wallet summary`                                              | Account summary with funding timeline and monthly rates                    |
| `wallet costs --extraBytes <n> --extraRunway <months>`        | Calculate upload costs and deposit needed for a given file size and runway |

### `foc-skill dataset` — Dataset Management

| Command                                        | Description                                                         |
| ---------------------------------------------- | ------------------------------------------------------------------- |
| `dataset list`                                 | List all PDP datasets with provider info, CDN status, and state     |
| `dataset details --dataSetId <id>` / `-d <id>` | Show dataset metadata and all pieces with their metadata            |
| `dataset create [providerId] [--cdn]`          | Create dataset with PDP provider (interactive selection if omitted) |
| `dataset upload <path> <providerId> [--cdn]`   | Create new dataset and upload file in one step                      |
| `dataset terminate <dataSetId>`                | Terminate a dataset (stop PDP service)                              |

### `foc-skill piece` — Piece Management

| Command                              | Description                                                  |
| ------------------------------------ | ------------------------------------------------------------ |
| `piece list <dataSetId>`             | List pieces in a dataset with CID, scanner URL, and metadata |
| `piece remove <dataSetId> <pieceId>` | Remove a piece from a dataset                                |

### `foc-skill upload <path>` — High-Level Upload (Recommended)

The primary upload command. Auto-selects provider, creates/reuses dataset, handles piece lifecycle.

| Option         | Default | Description                |
| -------------- | ------- | -------------------------- |
| `--copies <n>` | `2`     | Number of copies to create |
| `--withCDN`    | `false` | Enable CDN for the upload  |

```bash
foc-skill upload ./myfile.pdf                    # Auto everything
foc-skill upload ./myfile.pdf --withCDN          # With CDN
foc-skill upload ./myfile.pdf --copies 3         # 3 copies
foc-skill upload ./data.bin --chain 314          # Mainnet
```

### `foc-skill multi-upload <paths>` — Batch Upload

Upload multiple files in a single operation. Paths are comma-separated.

| Option         | Default | Description               |
| -------------- | ------- | ------------------------- |
| `--copies <n>` | `2`     | Number of copies per file |
| `--withCDN`    | `false` | Enable CDN for the upload |

```bash
foc-skill multi-upload ./a.pdf,./b.pdf           # Upload two files
foc-skill multi-upload ./a.pdf,./b.pdf --withCDN # With CDN
foc-skill multi-upload ./a.pdf,./b.pdf --copies 3 # 3 copies each
```

### `foc-skill provider` — Provider Info

| Command         | Description                                                                                |
| --------------- | ------------------------------------------------------------------------------------------ |
| `provider list` | List all approved PDP providers with details, location, pricing, and performance dashboard |

### `foc-skill docs` — Documentation Browser

Fetch FOC documentation directly from the CLI. Defaults to the LLM-friendly docs index (`llms.txt`), with smart filtering and page fetching.

| Option              | Description                                                            |
| ------------------- | ---------------------------------------------------------------------- |
| `--prompt <text>`   | What you're looking for — filters the docs index and suggests relevant pages |
| `--url <url>`       | Fetch a specific documentation URL (e.g. from the llms.txt index)      |

```bash
foc-skill docs                                          # Full docs index
foc-skill docs --prompt "how to upload files"           # Search for relevant pages
foc-skill docs --url https://docs.filecoin.cloud/getting-started  # Fetch specific page
```

The command returns CTAs suggesting relevant doc pages based on your prompt, making it easy to drill into specific topics.

## Common Workflows

### First-time setup (testnet)

```bash
foc-skill wallet init --auto        # Generate wallet
foc-skill wallet fund               # Get testnet FIL + USDFC
foc-skill wallet deposit 1          # Deposit 1 USDFC
foc-skill wallet balance            # Verify balances
```

### Upload a file

```bash
# Simplest — auto provider/dataset
foc-skill upload ./myfile.pdf

# With CDN
foc-skill upload ./myfile.pdf --withCDN

# Multiple files at once
foc-skill multi-upload ./a.pdf,./b.pdf

# Mid-level: create dataset + upload
foc-skill dataset upload ./myfile.pdf 1

# Check costs before uploading
foc-skill wallet costs --extraBytes 1000000 --extraRunway 1
```

### Manage data

```bash
foc-skill dataset list              # List all datasets
foc-skill dataset details -d 42     # View dataset details + pieces
foc-skill piece list 42             # List pieces in dataset 42
foc-skill piece remove 42 7         # Remove piece 7 from dataset 42
foc-skill dataset terminate 42      # Terminate dataset 42
```

### Explore documentation

```bash
# Browse the full docs index
foc-skill docs

# Search for topics
foc-skill docs --prompt "PDP verification"

# Fetch a specific page
foc-skill docs --url https://docs.filecoin.cloud/core-concepts/pdp-overview/
```

### Agent/programmatic usage

```bash
# Structured JSON output
foc-skill wallet balance --json
foc-skill dataset list --format json

# Filter output
foc-skill dataset list --filter-output datasets.dataSetId

# Check output size
foc-skill dataset list --token-count

# Full command schema (args, options, output)
foc-skill upload --schema
```

## Config Store

The CLI uses `conf` for persistent configuration, stored at the platform-specific config directory:

| Key          | Description                                               |
| ------------ | --------------------------------------------------------- |
| `privateKey` | Hex-encoded private key (set via `wallet init`)           |
| `keystore`   | Path to Foundry keystore file (alternative to privateKey) |

Config path: `~/Library/Preferences/foc-skill/config.json` (macOS)

The store is shared between CLI and MCP modes — initialize once, use everywhere.

## Architecture Notes

- **Synapse SDK** (`@filoz/synapse-sdk`) handles high-level storage + payment operations
- **Synapse Core** (`@filoz/synapse-core`) provides low-level chain interactions
- **viem** creates wallet/public clients for Filecoin chain interaction
- **incur** provides CLI framework with MCP, structured output, and agent discovery
- All transactions show block explorer links and wait for confirmation
- Interactive prompts (via `@clack/prompts`) for provider/dataset/piece selection when args omitted — automatically skipped in agent/pipe mode

## Documentation & References

- **FOC Docs:** https://docs.filecoin.cloud
- **LLM-friendly docs:** https://docs.filecoin.cloud/llms.txt
- **Synapse SDK:** https://github.com/FilOzone/synapse-sdk
- **FOC Architecture:** https://docs.filecoin.cloud/core-concepts/architecture/
- **PDP Overview:** https://docs.filecoin.cloud/core-concepts/pdp-overview/
- **Filecoin Pay:** https://docs.filecoin.cloud/core-concepts/filecoin-pay-overview/
- **Warm Storage:** https://docs.filecoin.cloud/core-concepts/fwss-overview/

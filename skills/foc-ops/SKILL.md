---
name: foc-ops
description: Filecoin Onchain Cloud storage operations — upload files, manage wallets/payments, datasets, pieces, and providers via the foc-skill CLI and MCP tools. Triggers on "upload", "store", "wallet", "deposit", "dataset", "piece", "provider", "USDFC", "PDP", "warm storage".
---

# foc-ops — Storage Operations

CLI + MCP tools for **Filecoin Onchain Cloud** — upload, pay, manage.

## Install

```bash
npm install -g foc-skill
# or
npx foc-skill --help
```

## Quick Start

```bash
foc-skill wallet init --auto        # generate wallet
foc-skill wallet fund               # testnet FIL + USDFC
foc-skill wallet deposit 1          # deposit 1 USDFC
foc-skill upload ./file.pdf         # upload (auto provider, 2 copies)
```

## Commands

### foc-skill upload

Upload a file to Filecoin warm storage (high-level, recommended)

#### Arguments

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `path` | `string` | yes | File path to upload |

#### Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--chain` | `number` | `314159` | Chain ID. 314159 = Calibration, 314 = Mainnet |
| `--copies` | `number` | `2` | Number of copies to create for each file |
| `--withCDN` | `boolean` |  | Enable CDN for the upload |
| `--debug` | `boolean` |  | Enable debug mode |

#### Examples

```sh
foc-skill upload ./myfile.pdf --copies 3 --withCDN true
foc-skill upload ./myfile.pdf --withCDN true
foc-skill upload ./data.bin --chain 314
```

### foc-skill multi-upload

Upload multiple files to Filecoin warm storage (high-level, recommended)

#### Arguments

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `paths` | `array` | yes | File paths to upload (comma-separated for CLI) |

#### Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--chain` | `number` | `314159` | Chain ID. 314159 = Calibration, 314 = Mainnet |
| `--copies` | `number` | `2` | Number of copies to create for each file |
| `--withCDN` | `boolean` |  | Enable CDN for the upload |
| `--debug` | `boolean` |  | Enable debug mode |

#### Examples

```sh
foc-skill multi-upload ./myfile.pdf,./myfile2.pdf --copies 3 --withCDN true
foc-skill multi-upload ./data.bin,./data2.bin --withCDN true
foc-skill multi-upload ./myfile.pdf,./myfile2.pdf,./data.bin,./data2.bin --chain 314
```

### foc-skill wallet init

Initialize wallet with a private key or keystore

#### Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--auto` | `boolean` |  | Generate a new random private key |
| `--keystore` | `string` |  | Path to a Foundry keystore file (requires foundry) |
| `--privateKey` | `string` |  | Private key (0x-prefixed hex) |

#### Examples

```sh
foc-skill wallet init
foc-skill wallet init --auto true
foc-skill wallet init --keystore ~/.foundry/keystores/alice
foc-skill wallet init --privateKey 0x...
```

### foc-skill wallet balance

Check FIL and USDFC wallet balances and payment account info

#### Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--chain` | `number` | `314159` | Chain ID. 314159 = Calibration, 314 = Mainnet |

#### Examples

```sh
foc-skill wallet balance
foc-skill wallet balance --chain 314
```

### foc-skill wallet fund

Request testnet FIL and USDFC from faucet (testnet only)

#### Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--chain` | `number` | `314159` | Chain ID. 314159 = Calibration, 314 = Mainnet |

> Only works on Calibration testnet (chain 314159).

### foc-skill wallet deposit

Deposit USDFC into payment account (uses permit approvals)

#### Arguments

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `amount` | `string` | yes | Amount of USDFC to deposit |

#### Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--chain` | `number` | `314159` | Chain ID. 314159 = Calibration, 314 = Mainnet |
| `--debug` | `boolean` |  | Enable debug mode |

#### Examples

```sh
foc-skill wallet deposit 1
foc-skill wallet deposit 10 --chain 314
```

### foc-skill wallet withdraw

Withdraw USDFC from payment account to wallet

#### Arguments

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `amount` | `string` | yes | Amount of USDFC to withdraw |

#### Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--chain` | `number` | `314159` | Chain ID. 314159 = Calibration, 314 = Mainnet |
| `--debug` | `boolean` |  | Enable debug mode |

#### Examples

```sh
foc-skill wallet withdraw 1
```

### foc-skill wallet summary

Get payment account summary with funding timeline

#### Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--chain` | `number` | `314159` | Chain ID. 314159 = Calibration, 314 = Mainnet |
| `--debug` | `boolean` |  | Enable debug mode |

### foc-skill wallet costs

Get costs for uploading a file to Filecoin warm storage

#### Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--chain` | `number` | `314159` | Chain ID. 314159 = Calibration, 314 = Mainnet |
| `--extraBytes` | `number` |  | Extra bytes to upload in bytes |
| `--extraRunway` | `number` |  | Extra runway in months |
| `--debug` | `boolean` |  | Enable debug mode |

#### Examples

```sh
foc-skill wallet costs --extraBytes 1000000
foc-skill wallet costs --extraBytes 1000000 --extraRunway 1
foc-skill wallet costs --extraBytes 1000000 --extraRunway 1 --chain 314
```

### foc-skill dataset create

Create a new PDP dataset with a storage provider

#### Arguments

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `providerId` | `number` | no | Provider ID (interactive selection if omitted) |

#### Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--chain` | `number` | `314159` | Chain ID. 314159 = Calibration, 314 = Mainnet |
| `--cdn` | `boolean` |  | Enable CDN for this dataset |
| `--debug` | `boolean` |  | Enable debug mode |

#### Examples

```sh
foc-skill dataset create
foc-skill dataset create 1
foc-skill dataset create 1 --cdn true
```

### foc-skill dataset details

Show dataset metadata and all pieces with their metadata

#### Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--dataSetId` | `number` |  | Dataset ID to inspect |
| `--chain` | `number` | `314159` | Chain ID. 314159 = Calibration, 314 = Mainnet |
| `--debug` | `boolean` |  | Enable debug mode |

### foc-skill dataset list

List all PDP datasets with provider info and status

#### Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--chain` | `number` | `314159` | Chain ID. 314159 = Calibration, 314 = Mainnet |
| `--debug` | `boolean` |  | Enable debug mode |

### foc-skill dataset upload

Upload a file to a new dataset (creates dataset + uploads piece)

#### Arguments

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `path` | `string` | yes | File path to upload |
| `providerId` | `number` | yes | Provider ID (use provider list to find) |

#### Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--chain` | `number` | `314159` | Chain ID. 314159 = Calibration, 314 = Mainnet |
| `--cdn` | `boolean` |  | Enable CDN |
| `--debug` | `boolean` |  | Enable debug mode |

#### Examples

```sh
foc-skill dataset upload ./myfile.pdf 1
foc-skill dataset upload ./data.bin 1 --cdn true
```

### foc-skill dataset terminate

Terminate a PDP dataset (stops storage service)

#### Arguments

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `dataSetId` | `number` | yes | Dataset ID to terminate (use dataset list to find) |

#### Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--chain` | `number` | `314159` | Chain ID. 314159 = Calibration, 314 = Mainnet |
| `--debug` | `boolean` |  | Enable debug mode |

#### Examples

```sh
foc-skill dataset terminate 42
```

### foc-skill piece list

List pieces in a dataset with metadata

#### Arguments

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `dataSetId` | `number` | yes | Dataset ID to list pieces from |

#### Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--chain` | `number` | `314159` | Chain ID. 314159 = Calibration, 314 = Mainnet |
| `--debug` | `boolean` |  | Enable debug mode |

#### Examples

```sh
foc-skill piece list 42
```

### foc-skill piece remove

Remove a piece from a dataset

#### Arguments

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `dataSetId` | `number` | yes | Dataset ID |
| `pieceId` | `number` | yes | Piece ID to remove |

#### Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--chain` | `number` | `314159` | Chain ID. 314159 = Calibration, 314 = Mainnet |
| `--debug` | `boolean` |  | Enable debug mode |

#### Examples

```sh
foc-skill piece remove 42 7
```

### foc-skill provider list

List all approved PDP storage providers with full details and performance dashboard

#### Options

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--chain` | `number` | `314159` | Chain ID. 314159 = Calibration, 314 = Mainnet |
| `--debug` | `boolean` |  | Enable debug mode |

#### Examples

```sh
foc-skill provider list
foc-skill provider list --chain 314
```

## Global Options

All commands accept: `--chain <id>` (314159=calibration, 314=mainnet), `--debug`, `--format <fmt>` (toon/json/yaml/md), `--json`, `-h`

## MCP Tools

All commands available as MCP tools: `wallet_init`, `wallet_balance`, `upload`, `multi-upload`, `dataset_list`, etc.

```bash
foc-skill mcp add                  # auto-detect agent
foc-skill --mcp                    # start MCP server
```

## Key Concepts

- **Piece**: content-addressed file chunk (CID)
- **Data Set**: container of pieces on one provider, with one payment rail
- **Payment Rail**: continuous USDFC stream from client to provider
- **Copies**: redundant storage across independent providers (min 2)
- **Pricing**: $2.5/TiB/month/copy, min 0.06 USDFC/month (~24 GiB)

## Config

Stored via `conf` at `~/Library/Preferences/foc-skill/config.json` (macOS). Keys: `privateKey`, `keystore`.

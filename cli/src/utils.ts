import type { Chain } from '@filoz/synapse-core/chains'
import terminalLink from 'terminal-link'

function networkSlug(chain: Chain): string {
  return chain.id === 314 ? 'mainnet' : 'calibration'
}

export function hashLink(hash: string, chain: Chain) {
  return terminalLink(hash, `${chain.blockExplorers?.default?.url}/tx/${hash}`)
}

export function datasetLink(dataSetId: string | bigint, chain: Chain) {
  const id = dataSetId.toString()
  return terminalLink(
    `#${id}`,
    `https://pdp.vxb.ai/${networkSlug(chain)}/dataset/${id}`
  )
}

export function pieceLink(pieceCid: string, chain: Chain) {
  return terminalLink(
    pieceCid,
    `https://pdp.vxb.ai/${networkSlug(chain)}/piece/${pieceCid}`
  )
}

export function datasetScannerUrl(dataSetId: string | bigint, chain: Chain) {
  return `https://pdp.vxb.ai/${networkSlug(chain)}/dataset/${dataSetId.toString()}`
}

export function pieceScannerUrl(pieceCid: string, chain: Chain) {
  return `https://pdp.vxb.ai/${networkSlug(chain)}/piece/${pieceCid}`
}

export function txExplorerUrl(hash: string, chain: Chain) {
  return `${chain.blockExplorers?.default?.url}/tx/${hash}`
}

export function dealbotDashboardUrl(chain: Chain) {
  return chain.id === 314
    ? 'https://dealbot.filoz.org'
    : 'https://staging.dealbot.filoz.org'
}

export function dealbotLink(chain: Chain) {
  const url = dealbotDashboardUrl(chain)
  return terminalLink('Dealbot Dashboard', url)
}

export function formatBytes(bytes: bigint): string {
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB']
  let value = Number(bytes)
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex++
  }
  return `${value % 1 === 0 ? value : value.toFixed(2)} ${units[unitIndex]}`
}

/**
 * Detects whether the CLI is running in agent/MCP mode.
 *
 * incur's MCP handler doesn't pass `agent: true` to command run contexts,
 * so c.agent is undefined when invoked via --mcp. This helper checks both
 * the run context AND process-level signals (--mcp flag, non-TTY stdout).
 */
export const mcpMode = process.argv.includes('--mcp')

export function isAgent(c: { agent?: boolean }): boolean {
  return c.agent === true || mcpMode || !process.stdout.isTTY
}

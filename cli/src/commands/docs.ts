import { z } from 'incur'
import { OutputContext } from '../output.ts'

const LLMS_TXT_URL = 'https://docs.filecoin.cloud/llms.txt'
const MAX_HEADER_DEPTH = 4 // #### max — skip ##### and deeper

interface DocEntry {
  title: string
  url: string
  description: string
  section: string
}

/**
 * Parse llms.txt into entries, filtering out entries under headers deeper than maxDepth.
 * This removes the bulk of API reference entries (##### Functions, etc.)
 */
function parseLlmsTxt(
  text: string,
  maxDepth: number = MAX_HEADER_DEPTH
): DocEntry[] {
  const entries: DocEntry[] = []
  const lines = text.split('\n')
  let currentSection = ''
  let skipSection = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Track section headers and check depth
    const headerMatch = line.match(/^(#{1,6})\s+(.*)/)
    if (headerMatch) {
      const depth = headerMatch[1].length
      if (depth > maxDepth) {
        skipSection = true
        continue
      }
      skipSection = false
      currentSection = headerMatch[2]
      continue
    }

    if (skipSection) continue

    // Match markdown links: - [Title](url): Description
    const match = line.match(/^-\s*\[([^\]]+)\]\(([^)]+)\):?\s*(.*)/)
    if (match) {
      entries.push({
        title: match[1],
        url: match[2],
        description: match[3] || match[1],
        section: currentSection,
      })
    }
  }

  return entries
}

/**
 * Filter markdown content to only include sections up to maxDepth header level.
 * Strips everything under headers deeper than maxDepth.
 */
function filterMarkdownByDepth(
  markdown: string,
  maxDepth: number = MAX_HEADER_DEPTH
): string {
  const lines = markdown.split('\n')
  const result: string[] = []
  let skip = false

  for (const line of lines) {
    const headerMatch = line.match(/^(#{1,6})\s/)
    if (headerMatch) {
      const depth = headerMatch[1].length
      if (depth > maxDepth) {
        skip = true
        continue
      }
      skip = false
    }

    if (!skip) {
      result.push(line)
    }
  }

  return result
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function matchEntries(entries: DocEntry[], prompt: string): DocEntry[] {
  const terms = prompt
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2)

  const scored = entries.map((entry) => {
    const haystack =
      `${entry.title} ${entry.description} ${entry.section} ${entry.url}`.toLowerCase()
    let score = 0
    for (const term of terms) {
      // Exact word match in title gets bonus
      if (entry.title.toLowerCase().includes(term)) score += 3
      // URL path segments are strong signals
      if (entry.url.toLowerCase().includes(term)) score += 2
      // General match
      if (haystack.includes(term)) score += 1
    }
    return { entry, score }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.entry)
}

/**
 * Format matched entries as a compact text summary for LLM consumption.
 */
function formatEntriesSummary(entries: DocEntry[]): string {
  const bySection = new Map<string, DocEntry[]>()
  for (const e of entries) {
    const section = e.section || 'General'
    if (!bySection.has(section)) bySection.set(section, [])
    bySection.get(section)?.push(e)
  }

  const parts: string[] = []
  for (const [section, sectionEntries] of bySection) {
    parts.push(`## ${section}`)
    for (const e of sectionEntries) {
      parts.push(`- **${e.title}**: ${e.description}`)
      parts.push(`  URL: ${e.url}`)
    }
    parts.push('')
  }
  return parts.join('\n')
}

export const docsCommand = {
  description:
    'Fetch Filecoin Onchain Cloud documentation. Search the index with --prompt, or fetch a specific page with --url. Content is filtered to reduce size.',
  options: z.object({
    prompt: z
      .string()
      .optional()
      .describe(
        "What you're looking for — searches the docs index and returns matched entries. If only 1-3 matches, auto-fetches the top result."
      ),
    url: z
      .string()
      .optional()
      .describe(
        'Fetch a specific documentation URL (e.g. from the index results)'
      ),
    maxDepth: z
      .number()
      .optional()
      .describe(
        'Maximum header depth to include (default 4 = ####). Use 6 for full detail, 2 for high-level overview only.'
      ),
    debug: z.boolean().optional().describe('Enable debug mode'),
  }),
  output: z.object({
    source: z.string(),
    content: z.string(),
    matchedEntries: z
      .array(
        z.object({
          title: z.string(),
          url: z.string(),
          description: z.string(),
          section: z.string(),
        })
      )
      .optional(),
  }),
  examples: [
    {
      options: { prompt: 'upload files' },
      description: 'Find docs about uploading — auto-fetches if few matches',
    },
    {
      options: { prompt: 'split operations' },
      description: 'Find docs about split/manual upload workflows',
    },
    {
      options: {
        url: 'https://docs.filecoin.cloud/developer-guides/storage/storage-operations.md',
      },
      description: 'Fetch a specific doc page (filtered to #### depth)',
    },
    {
      options: {
        url: 'https://docs.filecoin.cloud/developer-guides/storage/storage-operations.md',
        maxDepth: 6,
      },
      description: 'Fetch a page with full detail (all header depths)',
    },
  ],
  async run(c: any) {
    const out = new OutputContext(c)
    const maxDepth = c.options.maxDepth ?? MAX_HEADER_DEPTH

    try {
      // If --url is provided, fetch that specific page with depth filtering
      if (c.options.url) {
        out.step(`Fetching ${c.options.url}`)
        const resp = await fetch(c.options.url)
        if (!resp.ok) {
          return out.fail(
            'FETCH_FAILED',
            `Failed to fetch ${c.options.url}: ${resp.status} ${resp.statusText}`,
            {
              retryable: true,
              cta: {
                description: 'Try searching the docs index:',
                commands: [
                  {
                    command: 'docs',
                    options: { prompt: 'getting started' },
                    description: 'Search for getting started guides',
                  },
                ],
              },
            }
          )
        }

        const rawContent = await resp.text()
        const content = filterMarkdownByDepth(rawContent, maxDepth)

        return out.done(
          {
            source: c.options.url,
            content,
          },
          {
            cta: {
              description:
                'Need more detail? Re-fetch with --maxDepth 6, or explore related docs:',
              commands: [
                ...(maxDepth < 6
                  ? [
                      {
                        command: 'docs',
                        options: { url: c.options.url, maxDepth: 6 },
                        description: 'Fetch this page with full detail',
                      },
                    ]
                  : []),
                {
                  command: 'docs',
                  options: { prompt: 'storage' },
                  description: 'Search for more storage docs',
                },
              ],
            },
          }
        )
      }

      // Default: fetch llms.txt index
      out.step('Fetching docs index')
      const resp = await fetch(LLMS_TXT_URL)
      if (!resp.ok) {
        return out.fail(
          'FETCH_FAILED',
          `Failed to fetch docs index: ${resp.status} ${resp.statusText}`,
          { retryable: true }
        )
      }

      const text = await resp.text()
      const allEntries = parseLlmsTxt(text, maxDepth)

      // If --prompt is provided, search and potentially auto-fetch
      if (c.options.prompt) {
        out.step(`Searching for "${c.options.prompt}"`)
        const matched = matchEntries(allEntries, c.options.prompt)

        if (matched.length === 0) {
          // No matches — return compact index for browsing
          const summary = formatEntriesSummary(allEntries)
          return out.done(
            {
              source: LLMS_TXT_URL,
              content: summary,
              matchedEntries: allEntries,
            },
            {
              cta: {
                description: `No matches for "${c.options.prompt}". Browse these pages:`,
                commands: allEntries.slice(0, 5).map((e) => ({
                  command: 'docs',
                  options: { url: e.url },
                  description: `${e.title}: ${e.description}`,
                })),
              },
            }
          )
        }

        // Auto-fetch: if 1-3 matches, fetch the top result directly
        if (matched.length <= 3) {
          const topEntry = matched[0]
          out.step(`Auto-fetching top match: ${topEntry.title}`)

          const pageResp = await fetch(topEntry.url)
          if (pageResp.ok) {
            const rawContent = await pageResp.text()
            const content = filterMarkdownByDepth(rawContent, maxDepth)

            // Include other matches as CTAs
            const otherMatches = matched.slice(1).map((e) => ({
              command: 'docs',
              options: { url: e.url },
              description: `${e.title}: ${e.description}`,
            }))

            return out.done(
              {
                source: topEntry.url,
                content,
                matchedEntries: matched,
              },
              {
                cta: {
                  description:
                    matched.length > 1
                      ? `Also matched ${matched.length - 1} other page(s):`
                      : 'Explore more:',
                  commands: [
                    ...otherMatches,
                    ...(maxDepth < 6
                      ? [
                          {
                            command: 'docs',
                            options: { url: topEntry.url, maxDepth: 6 },
                            description: 'Re-fetch with full detail',
                          },
                        ]
                      : []),
                    {
                      command: 'docs',
                      options: { prompt: 'storage' },
                      description: 'Search for more docs',
                    },
                  ],
                },
              }
            )
          }
          // If fetch fails, fall through to returning entry list
        }

        // Multiple matches — return compact entry list (not full llms.txt!)
        const summary = formatEntriesSummary(matched)

        const ctaCommands = matched.slice(0, 5).map((e) => ({
          command: 'docs',
          options: { url: e.url },
          description: `${e.title}: ${e.description}`,
        }))

        return out.done(
          {
            source: LLMS_TXT_URL,
            content: summary,
            matchedEntries: matched,
          },
          {
            cta: {
              description: `Found ${matched.length} relevant page(s). Fetch one:`,
              commands: ctaCommands,
            },
          }
        )
      }

      // No prompt — return compact index summary (not raw llms.txt)
      const summary = formatEntriesSummary(allEntries)

      const ctaCommands = allEntries.slice(0, 5).map((e) => ({
        command: 'docs',
        options: { url: e.url },
        description: `${e.title}: ${e.description}`,
      }))

      return out.done(
        {
          source: LLMS_TXT_URL,
          content: summary,
          matchedEntries: allEntries,
        },
        {
          cta: {
            description: 'Fetch a specific page or search:',
            commands: [
              ...ctaCommands,
              {
                command: 'docs',
                options: { prompt: 'upload storage' },
                description: 'Or search with --prompt',
              },
            ],
          },
        }
      )
    } catch (error) {
      if (c.options.debug) console.error(error)
      return out.fail('DOCS_FETCH_FAILED', (error as Error).message, {
        retryable: true,
      })
    }
  },
}

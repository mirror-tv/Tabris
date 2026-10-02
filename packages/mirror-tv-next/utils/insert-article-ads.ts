export const ARTICLE_INLINE_AD = {
  gila: 'gila',
  mid: '300x250',
} as const

export type ArticleAdPair =
  (typeof ARTICLE_INLINE_AD)[keyof typeof ARTICLE_INLINE_AD]

export type HtmlContentPart =
  | { type: 'html'; html: string }
  | { type: 'ad'; pair: ArticleAdPair }

type ContentBlock = {
  id: string
  type: string
  content: unknown
  alignment?: string
}

const TEXT_BLOCK_TYPES = new Set(['unstyled', 'section'])

export function stripHtmlText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function getBlockHtml(block: ContentBlock): string {
  const raw = Array.isArray(block.content) ? block.content[0] : block.content
  return typeof raw === 'string' ? raw : ''
}

export function isApiDataTextParagraph(block: ContentBlock): boolean {
  if (!TEXT_BLOCK_TYPES.has(block.type)) {
    return false
  }
  return stripHtmlText(getBlockHtml(block)).length > 0
}

function createAdBlock(pair: ArticleAdPair): ContentBlock {
  return {
    id: `inserted-ad-${pair}`,
    type: 'gpt-ad',
    content: pair,
    alignment: 'center',
  }
}

export function insertAdsIntoApiData<T extends ContentBlock>(blocks: T[]): T[] {
  const next = [...blocks]
  const textIndices = next.reduce<number[]>((acc, block, index) => {
    if (isApiDataTextParagraph(block)) {
      acc.push(index)
    }
    return acc
  }, [])

  if (textIndices.length === 0) {
    next.push(createAdBlock(ARTICLE_INLINE_AD.mid) as T)
    return next
  }

  if (textIndices.length === 1) {
    next.splice(textIndices[0] + 1, 0, createAdBlock(ARTICLE_INLINE_AD.gila) as T)
    next.push(createAdBlock(ARTICLE_INLINE_AD.mid) as T)
    return next
  }

  next.splice(textIndices[1] + 1, 0, createAdBlock(ARTICLE_INLINE_AD.mid) as T)
  next.splice(textIndices[0] + 1, 0, createAdBlock(ARTICLE_INLINE_AD.gila) as T)
  return next
}

const P_TAG_RE = /<p\b[^>]*>[\s\S]*?<\/p>/gi
const WRAPPER_TAGS = new Set(['div', 'section', 'article'])
const HTML_TAG_RE = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/gi

function hasUnbalancedWrappers(html: string): boolean {
  const delta: Record<string, number> = {
    div: 0,
    section: 0,
    article: 0,
  }

  HTML_TAG_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = HTML_TAG_RE.exec(html)) !== null) {
    const tag = match[1].toLowerCase()
    if (!WRAPPER_TAGS.has(tag)) {
      continue
    }
    const token = match[0]
    if (/\/>$/.test(token.trim())) {
      continue
    }
    if (token.startsWith('</')) {
      delta[tag] -= 1
    } else {
      delta[tag] += 1
    }
  }

  return Object.values(delta).some((count) => count !== 0)
}

function fallbackEndMid(source: string): HtmlContentPart[] {
  const parts: HtmlContentPart[] = []
  if (source.length > 0) {
    parts.push({ type: 'html', html: source })
  }
  parts.push({ type: 'ad', pair: ARTICLE_INLINE_AD.mid })
  return parts
}

function getHtmlTextParagraphs(
  html: string
): { start: number; end: number }[] {
  const matches: { start: number; end: number }[] = []
  P_TAG_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = P_TAG_RE.exec(html)) !== null) {
    if (stripHtmlText(match[0]).length > 0) {
      matches.push({ start: match.index, end: match.index + match[0].length })
    }
  }
  return matches
}

export function splitHtmlWithArticleAds(html: string): HtmlContentPart[] {
  const source = html ?? ''
  const paragraphs = getHtmlTextParagraphs(source)
  const inserts: { at: number; pair: ArticleAdPair }[] = []

  if (paragraphs.length === 0) {
    inserts.push({ at: source.length, pair: ARTICLE_INLINE_AD.mid })
  } else if (paragraphs.length === 1) {
    inserts.push({ at: paragraphs[0].end, pair: ARTICLE_INLINE_AD.gila })
    inserts.push({ at: source.length, pair: ARTICLE_INLINE_AD.mid })
  } else {
    inserts.push({ at: paragraphs[0].end, pair: ARTICLE_INLINE_AD.gila })
    inserts.push({ at: paragraphs[1].end, pair: ARTICLE_INLINE_AD.mid })
  }

  const parts: HtmlContentPart[] = []
  let cursor = 0
  for (const insert of inserts) {
    if (insert.at > cursor) {
      parts.push({ type: 'html', html: source.slice(cursor, insert.at) })
    }
    parts.push({ type: 'ad', pair: insert.pair })
    cursor = insert.at
  }
  if (cursor < source.length) {
    parts.push({ type: 'html', html: source.slice(cursor) })
  }

  const sliced = parts.filter(
    (part) => part.type === 'ad' || part.html.length > 0
  )
  const brokeWrapper = sliced.some(
    (part) => part.type === 'html' && hasUnbalancedWrappers(part.html)
  )
  if (brokeWrapper) {
    return fallbackEndMid(source)
  }
  return sliced
}

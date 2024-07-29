// reference: https://developers.google.com/custom-search/v1/reference/rest/v1/Search?hl=zh-tw
export type SearchResponse = {
  kind: string
  url: Url
  queries: Queries
  context: Context
  searchInformation: SearchInformation
  items: SearchItem[]
}

type Url = {
  type: string
  template: string
}

type Queries = {
  request: Query[]
  nextPage?: Query[]
}

type Query = {
  title: string
  totalResults: string
  searchTerms: string
  count: number
  startIndex: number
  inputEncoding: string
  outputEncoding: string
  safe: string
  cx: string
}

type Context = {
  title: string
}

type SearchInformation = {
  searchTime: number
  formattedSearchTime: string
  totalResults: string
  formattedTotalResults: string
}

export type SearchItem = {
  kind: string
  title: string
  htmlTitle: string
  link: string
  displayLink: string
  snippet: string
  htmlSnippet: string
  cacheId: string
  formattedUrl: string
  htmlFormattedUrl: string
  pagemap: PageMap
}

type PageMap = {
  cse_thumbnail?: Thumbnail[]
  metatags?: MetaTag[]
  cse_image?: Image[]
}

type Thumbnail = {
  src: string
  width: string
  height: string
}

type MetaTag = {
  referrer?: string
  'og:image'?: string
  'og:type'?: string
  viewport?: string
  'og:title'?: string
  'og:url'?: string
  'og:description'?: string
  'article:published_time': string
  datePublished?: string
}

type Image = {
  src: string
}

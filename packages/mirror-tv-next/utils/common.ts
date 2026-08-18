import { CombinedGraphQLErrors } from '@apollo/client/errors'
import errors from '@twreporter/errors'
import type { ApiData } from '~/types/api-data'

function isServer(): boolean {
  return typeof window === 'undefined'
}

// Extract YouTube video ID from URL
const extractYoutubeId = (url: string) => {
  const match = url?.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )

  return match ? match[1] : ''
}

const handleResponse = <
  T extends Record<string, unknown>,
  U extends PromiseSettledResult<T>,
  V
>(
  response: U,
  callback: (value: T | undefined) => V,
  errorMessage: string
): V => {
  if (response.status === 'fulfilled') {
    return callback(response.value)
  } else if (response.status === 'rejected') {
    const reason: unknown = response.reason
    const annotatingError = errors.helpers.wrap(
      reason,
      'UnhandledError',
      errorMessage
    )

    const debugPayload = CombinedGraphQLErrors.is(reason)
      ? { graphQLErrors: reason.errors }
      : reason instanceof Error
      ? {
          error: {
            name: reason.name,
            message: reason.message,
            stack: reason.stack,
          },
        }
      : { error: reason }

    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(
          annotatingError,
          {
            withStack: true,
            withPayload: true,
          },
          0,
          0
        ),
        debugPayload,
      })
    )
  }
  return callback(undefined)
}

function handleMetaDesc(str: string) {
  if (!str || typeof str !== 'string') {
    return ''
  }
  // remove html tags and set length limit for meta descripton
  const pureStr = str?.replace(/<[^>]*>?/gm, '')
  const formatedStr = pureStr?.slice(0, 124) ?? ''
  return formatedStr.length > 123 ? formatedStr + '...' : formatedStr
}

function handleApiData(apiData: unknown): ApiData[] {
  try {
    if (!apiData) return []

    // already parsed
    if (Array.isArray(apiData)) {
      return (apiData as ApiData[]).filter(Boolean)
    }

    // common case: stringified JSON array
    if (typeof apiData === 'string') {
      const parsed = JSON.parse(apiData) as unknown
      return Array.isArray(parsed) ? (parsed as ApiData[]).filter(Boolean) : []
    }

    // any other shape is not supported by ApiData renderer
    return []
  } catch {
    return []
  }
}

const getFirstElement = <T>(data: T[]) => data[0]

// Manual tags first (keeps editor order), then AI tags whose name is not
// already present. Rendering treats both sources identically.
const mergeTagsByName = <T extends { name: string }>(
  tags: T[] = [],
  algoTags: T[] = []
): T[] => {
  const seen = new Set<string>()
  const merged: T[] = []
  for (const tag of [...tags, ...algoTags]) {
    if (!tag?.name || seen.has(tag.name)) continue
    seen.add(tag.name)
    merged.push(tag)
  }
  return merged
}

export {
  extractYoutubeId,
  isServer,
  handleResponse,
  handleApiData,
  handleMetaDesc,
  getFirstElement,
  mergeTagsByName,
}

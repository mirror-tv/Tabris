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
    const { graphQLErrors, clientErrors, networkError } = response.reason
    const annotatingError = errors.helpers.wrap(
      response.reason,
      'UnhandledError',
      errorMessage
    )

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
        debugPayload: {
          graphQLErrors,
          clientErrors,
          networkError,
        },
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

function handleApiData(apiData: string): ApiData[] {
  try {
    const rawString = apiData ?? ''
    const content = JSON.parse(rawString)

    return content?.filter((item: ApiData) => item) || []
  } catch {
    return []
  }
}

class FetchError extends Error {
  public code: number

  constructor(url: string, message: string = 'Not Found', code: number = 404) {
    const errorMessage = `${message}, url: ${url}`
    super(errorMessage)
    this.name = this.constructor.name
    this.code = code
  }
}

export {
  extractYoutubeId,
  isServer,
  handleResponse,
  handleApiData,
  handleMetaDesc,
  FetchError,
}

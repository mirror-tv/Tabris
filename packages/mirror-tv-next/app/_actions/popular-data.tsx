'use server'
import errors from '@twreporter/errors'
import {
  type RawPopularListJson,
  type RawPopularPost,
} from '~/types/popular-post'
import { fetchStaticJson } from '~/utils/fetch-static-json'

async function fetchPopularPosts(): Promise<{ data: RawPopularPost[] }> {
  try {
    const rawData = await fetchStaticJson<RawPopularListJson>(
      'popularlist.json'
    )
    const data = JSON.parse(JSON.stringify(rawData)) as RawPopularListJson
    // Ensure data is parsed and not referencing the original object
    // https://github.com/vercel/next.js/issues/47447

    return { data: (data.report ?? []) as RawPopularPost[] }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching popular posts'
    )

    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(annotatingError, {
          withStack: false,
          withPayload: true,
        }),
      })
    )
    throw annotatingError
  }
}

export { fetchPopularPosts }

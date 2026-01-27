'use server'
import errors from '@twreporter/errors'
import {
  GLOBAL_CACHE_SETTING,
  POPULAR_POSTS_URL,
} from '~/constants/environment-variables'
import { type RawPopularPost } from '~/types/popular-post'
async function fetchPopularPosts(): Promise<{ data: RawPopularPost[] }> {
  try {
    const res = await fetch(POPULAR_POSTS_URL, {
      next: { revalidate: GLOBAL_CACHE_SETTING },
    })

    if (!res.ok) {
      console.error('Failed to fetch popular posts data')
      return { data: [] } as { data: RawPopularPost[] }
    }

    const rawData = await res.json()
    const data = JSON.parse(JSON.stringify(rawData))
    // Ensure data is parsed and not referencing the original object
    // https://github.com/vercel/next.js/issues/47447

    return { data: data.report }
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

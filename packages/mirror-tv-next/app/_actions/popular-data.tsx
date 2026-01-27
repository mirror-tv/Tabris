'use server'
import errors from '@twreporter/errors'
import {
  GLOBAL_CACHE_SETTING,
  POPULAR_POSTS_URL,
} from '~/constants/environment-variables'
import {
  type PopularListReportItem,
  type RawPopularListJson,
  type RawPopularPost,
} from '~/types/popular-post'

/**
 * Convert popularlist heroImage format { w480, w800, original? } to legacy format { urlOriginal, urlMobileSized, urlTabletSized, urlTinySized }
 * When original is missing, falls back to w800 or w480 so images still render.
 */
function convertPopularPostHeroImage(
  heroImage: PopularListReportItem['heroImage']
): RawPopularPost['heroImage'] {
  if (!heroImage) {
    return null
  }

  // If it's already in legacy format, return as is
  if ('urlOriginal' in heroImage || 'urlMobileSized' in heroImage) {
    return heroImage as RawPopularPost['heroImage']
  }

  // Convert new format to legacy format (urlOriginal fallback: original ?? w800 ?? w480)
  const urlOriginal =
    heroImage.original?.trim() ||
    heroImage.w800?.trim() ||
    heroImage.w480?.trim() ||
    undefined
  if (!urlOriginal) {
    return null
  }
  return {
    urlOriginal,
    urlMobileSized: heroImage.w800 ?? undefined,
    urlTabletSized: heroImage.w800 ?? undefined,
    urlTinySized: heroImage.w480 ?? undefined,
  }
}

async function fetchPopularPosts(): Promise<{ data: RawPopularPost[] }> {
  try {
    const res = await fetch(POPULAR_POSTS_URL, {
      next: { revalidate: GLOBAL_CACHE_SETTING },
    })

    if (!res.ok) {
      console.error('Failed to fetch popular posts data')
      return { data: [] } as { data: RawPopularPost[] }
    }

    const rawData = (await res.json()) as RawPopularListJson
    const data = JSON.parse(JSON.stringify(rawData)) as RawPopularListJson
    // Ensure data is parsed and not referencing the original object
    // https://github.com/vercel/next.js/issues/47447

    // Transform heroImage format (w480, w800) -> (urlOriginal, urlMobileSized, urlTabletSized, urlTinySized)
    const transformedReport: RawPopularPost[] = (data.report ?? []).map(
      (post: PopularListReportItem) => ({
        ...post,
        heroImage: convertPopularPostHeroImage(post.heroImage),
      })
    )

    return { data: transformedReport }
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

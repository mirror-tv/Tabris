'use server'
import errors from '@twreporter/errors'
import {
  GLOBAL_CACHE_SETTING,
  HEADER_JSON_URL,
} from '~/constants/environment-variables'
import type { HeaderData } from '~/types/header'

async function fetchHeaderJson() {
  let data: HeaderData = {
    allSponsors: [],
    allCategories: [],
    allShows: [],
  }
  try {
    const res = await fetch(HEADER_JSON_URL, {
      next: { revalidate: GLOBAL_CACHE_SETTING },
    })

    if (!res.ok) {
      console.error('Failed to fetch header data')
      return { data }
    }

    const rawData = await res.json()
    data = JSON.parse(JSON.stringify(rawData))
    // Ensure data is parsed and not referencing the original object
    // https://github.com/vercel/next.js/issues/47447

    return { data }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching header json'
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

export { fetchHeaderJson }

import errors from '@twreporter/errors'
import type { Podcast } from '~/types/common'
import { fetchStaticJson } from '~/utils/fetch-static-json'
import PodcastsList from './podcasts-list'

export default async function PodcastsListHandler() {
  let podcasts: Podcast[]
  try {
    podcasts = await fetchStaticJson<Podcast[]>('podcast_list.json')
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching category posts data in category page'
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
  return !!podcasts.length && <PodcastsList podcasts={podcasts} />
}

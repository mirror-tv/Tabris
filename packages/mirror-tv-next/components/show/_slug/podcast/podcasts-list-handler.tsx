import errors from '@twreporter/errors'
import type { Podcast } from '~/types/common'
import { ENV } from '~/constants/environment-variables'
import axios from 'axios'
import PodcastsList from './podcasts-list'

export default async function PodcastsListHandler() {
  let podcasts: Podcast[]
  try {
    const podcastsEndpoint =
      ENV === 'prod' || ENV === 'staging'
        ? 'https://www.mnews.tw/json/podcast_list.json'
        : 'https://dev.mnews.tw/json/podcast_list.json'
    const response = await axios.get(podcastsEndpoint)
    podcasts = response.data
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

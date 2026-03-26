import 'server-only'
import type { YoutubeResponse } from '~/types/youtube'
import axios, { AxiosResponse } from 'axios'
import { YOUTUBE_API_URL } from '~/constants/endpoint-config'
import { FetchError } from '../common'

async function fetchYoutubeData(url: string): Promise<YoutubeResponse> {
  try {
    const axiosConfig = {
      timeout: 3000,
    }
    const response: AxiosResponse = await axios.get(
      `${YOUTUBE_API_URL}/api/youtube${url}`,
      axiosConfig
    )
    return response.data
  } catch (err) {
    const error = err as FetchError
    throw new FetchError(url, error.message, error.code ?? 500)
  }
}

export { fetchYoutubeData }

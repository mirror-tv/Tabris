'use server'
import axios from 'axios'
import { URL_PROGRAMABLE_SEARCH } from '~/constants/constant'
import {
  PROGRAMMABLE_SEARCH_API_KEY,
  PROGRAMMABLE_SEARCH_ENGINE_ID,
} from '~/constants/config'
import type { SearchItem, SearchResponse } from '~/types/search'

export async function searchAPI(
  query: string | string[],
  startIndex: number,
  getAmount: number
) {
  const url = `${URL_PROGRAMABLE_SEARCH}`
  const maxResultsPerRequest = 10
  const getParams = (num: number, start: number) => {
    return {
      cx: `${PROGRAMMABLE_SEARCH_ENGINE_ID}`,
      key: `${PROGRAMMABLE_SEARCH_API_KEY}`,
      q: query,
      start,
      num,
      safe: 'active',
    }
  }

  const allItems: SearchItem[] = []
  let currentStartIndex = startIndex
  let combinedResponse: SearchResponse | null = null

  try {
    while (allItems.length < getAmount) {
      const numResultsToFetch = Math.min(
        maxResultsPerRequest,
        getAmount - allItems.length
      )
      const params = getParams(numResultsToFetch, currentStartIndex)

      const response = await axios.get(url, { params })
      const data: SearchResponse = response.data

      if (!combinedResponse) {
        combinedResponse = { ...data, items: [] }
      }
      if (data.items) {
        allItems.push(...data.items)
      }
      if (!data.queries?.nextPage) {
        // No more results available
        break
      }
      // Update the start index for the next request
      currentStartIndex += numResultsToFetch
    }

    if (combinedResponse) {
      combinedResponse.items = allItems
    }

    return combinedResponse
  } catch (error) {
    // @ts-expect-error Property 'stack' is not guaranteed to exist on 'error'
    console.log(JSON.stringify({ severity: 'ERROR', message: error.stack }))
    return null
  }
}

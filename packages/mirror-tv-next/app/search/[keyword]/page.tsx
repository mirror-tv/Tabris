import NoSearchResult from '~/components/search/no-search-result'
import SearchResult from '~/components/search/search-result'
import errors from '@twreporter/errors'
import { searchAPI } from './action'
import type { SearchResponse, SearchItem } from '~/types/search'

type SearchPageProps = {
  params: { keyword: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function SearchPage({ params }: SearchPageProps) {
  const keyword = decodeURI(params.keyword)
  const startIndex = 1
  let searchResultList: SearchItem[] = []
  let searchResultNumber: number = 0
  try {
    const inputValue = keyword || ''
    const response: SearchResponse | null = await searchAPI(
      inputValue,
      startIndex,
      20
    )

    searchResultList = response?.items || []
    searchResultNumber = response?.searchInformation.totalResults
      ? parseInt(response?.searchInformation.totalResults)
      : 0
  } catch (err) {
    // All exceptions that include a stack trace will be
    // integrated with Error Reporting.
    // See https://cloud.google.com/run/docs/error-reporting
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(
          err,
          {
            withStack: true,
            withPayload: true,
          },
          0,
          0
        ),
      })
    )
  }

  if (!searchResultList.length) return <NoSearchResult keyword={keyword} />

  const searchResultProps = {
    keyword,
    searchResultList,
    startIndex,
    searchResultNumber,
  }
  return <SearchResult {...searchResultProps} />
}

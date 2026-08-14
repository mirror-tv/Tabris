'use server'
import errors from '@twreporter/errors'
import { getClient } from '~/apollo-client'
import { Sale, getSales } from '~/graphql/query/sales'

type FetchSalesType = {
  take: number
  pageName: string
}

async function fetchSales({ take, pageName }: FetchSalesType): Promise<{
  data: { allSales: Sale[] }
}> {
  try {
    const { data } = await getClient().query({
      query: getSales,
      variables: {
        first: take,
      },
    })
    return { data: data ?? { allSales: [] } }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      `Error occurs while fetching sales in ${pageName}`
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
  }
  return { data: { allSales: [] } }
}

export { fetchSales }

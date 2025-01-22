'use server'
import { getClient } from '~/apollo-client'
import { type Category, fetchCategoryBySlug } from '~/graphql/query/category'
import errors from '@twreporter/errors'

export async function fetchCategoryData(slug: string): Promise<Category> {
  const client = getClient()
  try {
    const { data } = await client.query<{
      allCategories: Category[]
    }>({
      query: fetchCategoryBySlug,
      variables: {
        slug,
      },
    })
    return data?.allCategories?.[0] ?? { name: '', slug: '' }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching category data in category page'
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
    return { name: '', slug: '' }
  }
}

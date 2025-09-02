'use server'

import { getClient } from '~/apollo-client'
import { gql } from '~/graphql/__generated__/gql'
import {
  editorChoicesResponseSchema,
  latestPostsResponseSchema,
  type EditorChoicesResponse,
  type LatestPostsResponse,
} from '~/utils/data-schema'

/**
 * Example of using generated GraphQL types and Zod validation
 * This demonstrates the new pattern for fetching and validating data
 */

// Example 1: Using generated gql function with type safety
const FETCH_EDITOR_CHOICES = gql(`
  query fetchEditorChoices {
    allEditorChoices(
      where: { state: published, choice: { state: published } }
      sortBy: [sortOrder_ASC, createdAt_DESC]
    ) {
      choice {
        name
        slug
        heroImage {
          urlOriginal
          urlDesktopSized
          urlTabletSized
          urlMobileSized
          urlTinySized
        }
        heroVideo {
          coverPhoto {
            urlOriginal
            urlDesktopSized
            urlTabletSized
            urlMobileSized
            urlTinySized
          }
        }
      }
    }
  }
`)

const FETCH_LATEST_POSTS = gql(`
  query fetchLatestPosts($first: Int = 5, $filteredSlug: [String] = [""]) {
    allPosts(
      where: {
        slug_not_in: $filteredSlug
        categories_some: { slug_not_in: "ombuds" }
        state: published
      }
      first: $first
      sortBy: publishTime_DESC
    ) {
      publishTime
      slug
      style
      name
      heroImage {
        urlOriginal
        urlDesktopSized
        urlTabletSized
        urlMobileSized
        urlTinySized
      }
    }
  }
`)

/**
 * Example function showing the new pattern:
 * 1. Use generated gql function for type safety
 * 2. Fetch data with Apollo Client
 * 3. Validate response with Zod schema
 * 4. Return typed and validated data
 */
export async function getEditorChoicesWithValidation(): Promise<EditorChoicesResponse | null> {
  try {
    const client = getClient()
    const { data } = await client.query({
      query: FETCH_EDITOR_CHOICES,
      fetchPolicy: 'no-cache',
    })

    // Validate data with Zod - this ensures runtime type safety
    const validatedData = editorChoicesResponseSchema.parse(data)
    return validatedData
  } catch (error) {
    console.error('Error fetching editor choices:', error)
    return null
  }
}

export async function getLatestPostsWithValidation(): Promise<LatestPostsResponse | null> {
  try {
    const client = getClient()
    const { data } = await client.query({
      query: FETCH_LATEST_POSTS,
      variables: { first: 10 },
      fetchPolicy: 'no-cache',
    })

    // Validate data with Zod - this ensures runtime type safety
    const validatedData = latestPostsResponseSchema.parse(data)
    return validatedData
  } catch (error) {
    console.error('Error fetching latest posts:', error)
    return null
  }
}

/**
 * Example of how to use the validated data in components
 */
export async function getHomepageDataExample() {
  const [editorChoices, latestPosts] = await Promise.all([
    getEditorChoicesWithValidation(),
    getLatestPostsWithValidation(),
  ])

  return {
    editorChoices: editorChoices?.allEditorChoices || [],
    latestPosts: latestPosts?.allPosts || [],
  }
}

'use server'
import errors from '@twreporter/errors'
import { z } from 'zod'
import { getClient } from '~/apollo-client'
import {
  type PostWithCategory,
  getPostsWithCategory,
  getLatestPosts,
  type PostCardItem,
} from '~/graphql/query/posts'
import {
  EditorChoices,
  fetchEditorChoices,
} from '~/graphql/query/editor-choices'

import { createDataFetchingChain } from '~/utils/fetch-function'
import { ENV } from '~/constants/environment-variables'

const ImageApiDataSizeSchema = z.object({
  url: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
})

const ImageApiDataSchema = z.object({
  url: z.string().optional(),
  w480: ImageApiDataSizeSchema.optional(),
  w800: ImageApiDataSizeSchema.optional(),
  w1200: ImageApiDataSizeSchema.optional(),
  w1600: ImageApiDataSizeSchema.optional(),
  w2400: ImageApiDataSizeSchema.optional(),
  original: ImageApiDataSizeSchema.optional(),
})

const HeroImageSchema = z.object({
  imageApiData: z.union([z.string(), ImageApiDataSchema]).optional(),
})

const FlexibleHeroImageSchema = z.union([z.string(), HeroImageSchema, z.null()])

const StaticEditorChoiceSchema = z.object({
  name: z.string(),
  slug: z.string(),
  heroImage: FlexibleHeroImageSchema,
  heroVideo: z
    .object({
      coverPhoto: HeroImageSchema.nullable(),
    })
    .nullable()
    .optional(),
  source: z.string(),
  exclusive: z
    .any()
    .transform((val) => {
      if (val === null || val === undefined) return null
      if (typeof val === 'boolean') return val
      if (val === 'true' || val === true) return true
      if (val === 'false' || val === false) return false
      return null
    })
    .nullable(),
})

const StaticLatestPostSchema = z.object({
  slug: z.string(),
  style: z.string().optional(),
  name: z.string(),
  thumbnail: z.string().optional(),
  partner: z
    .object({
      name: z.string(),
      slug: z.string(),
    })
    .optional(),
  publishTime: z.any().transform((val) => {
    if (val instanceof Date) return val.toISOString()
    if (typeof val === 'string') return val
    if (typeof val === 'number') return new Date(val).toISOString()
    if (val === null || val === undefined) return new Date().toISOString()
    return String(val)
  }),
  heroImage: FlexibleHeroImageSchema,
  categories: z
    .array(
      z.object({
        slug: z.string().optional(),
        name: z.string(),
      })
    )
    .optional(),
  heroVideo: z
    .object({
      coverPhoto: HeroImageSchema.nullable(),
    })
    .nullable()
    .optional(),
  exclusive: z
    .any()
    .transform((val) => {
      if (val === null || val === undefined) return null
      if (typeof val === 'boolean') return val
      if (val === 'true' || val === true) return true
      if (val === 'false' || val === false) return false
      return null
    })
    .nullable(),
})

const StaticHomepageResponseSchema = z.object({
  timestamp: z.string().optional(),
  partners: z.array(z.string()).optional(),
  choices: z.array(StaticEditorChoiceSchema).optional(),
  latest: z.array(StaticLatestPostSchema),
})

const ListingPostSchema = z.object({
  slug: z.string(),
  style: z.string().optional(),
  name: z.string(),
  heroImage: HeroImageSchema.nullable(),
  exclusive: z
    .any()
    .transform((val) => {
      if (val === null || val === undefined) return null
      if (typeof val === 'boolean') return val
      if (val === 'true' || val === true) return true
      if (val === 'false' || val === false) return false
      return null
    })
    .nullable(),
})

const PostWithCategorySchema = ListingPostSchema.extend({
  publishTime: z.any().transform((val) => {
    if (val instanceof Date) return val
    if (typeof val === 'string') return new Date(val)
    if (typeof val === 'number') return new Date(val)
    if (val === null || val === undefined) return new Date()
    return new Date(String(val))
  }),
  categories: z.array(
    z.object({
      slug: z.string(),
      name: z.string(),
    })
  ),
  heroVideo: z
    .object({
      coverPhoto: HeroImageSchema.nullable(),
    })
    .nullable(),
})

const GraphQLEditorChoicesResponseSchema = z.object({
  allEditorChoices: z.array(
    z.object({
      choice: z.object({
        name: z.string(),
        slug: z.string(),
        heroImage: HeroImageSchema.nullable(),
        heroVideo: z
          .object({
            coverPhoto: HeroImageSchema.nullable(),
          })
          .nullable(),
        exclusive: z
          .any()
          .transform((val) => {
            if (val === null || val === undefined) return null
            if (typeof val === 'boolean') return val
            if (val === 'true' || val === true) return true
            if (val === 'false' || val === false) return false
            return null
          })
          .nullable(),
      }),
    })
  ),
})

const GraphQLLatestPostsResponseSchema = z.object({
  allPosts: z.array(PostWithCategorySchema),
  _allPostsMeta: z
    .object({
      count: z.number(),
    })
    .optional(),
})

type GetLatestPostsServerActionType = {
  first: number
  skip: number
  withCount: boolean
  filteredSlug: string[]
  jsonPage: number
}

async function fetchLatestPostsAndEditorChoices({ page }: { page: number }) {
  const timestamp = Date.now()
  const resp = await fetch(
    `https://storage.googleapis.com/static-mnews-tw-${ENV}/files/json/latest_posts0${page}.json?timestamp=${
      timestamp / 100
    }`
  )
  if (!resp.ok) {
    throw new Error(`HTTP error! status: ${resp.status}`)
  }
  const jsonData = await resp.json()
  const result = StaticHomepageResponseSchema.safeParse(jsonData)

  if (!result.success) {
    throw new Error(
      `Zod validation failed: ${JSON.stringify(result.error.issues)}`
    )
  }

  return result.data
}

async function getLatestPostsAndEditorChoices({
  first = 12,
  skip = 0,
  withCount = false,
  filteredSlug = [],
  jsonPage = 1,
}: Partial<GetLatestPostsServerActionType> = {}): Promise<{
  data: {
    latest: PostWithCategory[]
    choices: EditorChoices[]
    _allPostsMeta?: { count: number }
    source: 'json' | 'graphql'
  }
}> {
  const errorLogger = (err: unknown) => {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching homepage data'
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

  let data: {
    latest: PostWithCategory[]
    choices: EditorChoices[]
    _allPostsMeta?: { count: number }
    source: 'json' | 'graphql'
  }

  if (jsonPage) {
    data = await createDataFetchingChain<{
      latest: PostWithCategory[]
      choices: EditorChoices[]
      _allPostsMeta?: { count: number }
      source: 'json' | 'graphql'
    }>(
      errorLogger,
      { latest: [], choices: [], source: 'graphql' as const },
      async () => {
        const validatedData = await fetchLatestPostsAndEditorChoices({
          page: jsonPage,
        })

        const transformedChoices = (validatedData.choices || []).map(
          (choice) => ({
            choice: {
              name: choice.name,
              slug: choice.slug,
              source: choice.source,
              heroImage:
                typeof choice.heroImage === 'string'
                  ? {
                      imageApiData: {
                        url: choice.heroImage,
                        original: { url: choice.heroImage },
                      },
                    }
                  : choice.heroImage || {
                      imageApiData: {
                        url: '',
                      },
                    },
              heroVideo: choice.heroVideo || {
                coverPhoto: {
                  imageApiData: {
                    url: '',
                  },
                },
              },
              exclusive: choice.exclusive ?? false,
            },
          })
        )

        const transformedPosts = validatedData.latest.map((post) => ({
          slug: post.slug,
          style: post.style,
          name: post.name,
          partner: post.partner,
          heroImage:
            typeof post.heroImage === 'string'
              ? {
                  imageApiData: {
                    url: post.heroImage,
                    original: { url: post.heroImage },
                  },
                }
              : post.heroImage,
          publishTime: new Date(post.publishTime),
          categories: (post.categories || []).map((category) => ({
            slug: category.slug || category.name?.toLowerCase() || 'unknown',
            name: category.name,
          })),
          heroVideo: {
            coverPhoto: post.heroVideo?.coverPhoto || {
              imageApiData: {
                url: '',
              },
            },
          },
          exclusive: post.exclusive,
        }))

        const transformedData = {
          latest: transformedPosts,
          choices: transformedChoices,
          _allPostsMeta: withCount ? { count: 200 } : undefined,
          source: 'json' as const,
        }

        return transformedData
      },
      async () => {
        const client = getClient()

        const [editorChoicesResult, latestPostsResult] = await Promise.all([
          client.query<{
            allEditorChoices: EditorChoices[]
          }>({
            query: fetchEditorChoices,
          }),
          client.query<{
            allPosts: PostWithCategory[]
            _allPostsMeta?: { count: number }
          }>({
            query: getPostsWithCategory,
            variables: {
              first,
              skip,
              withCount,
              filteredSlug,
            },
          }),
        ])

        const editorChoicesValidation =
          GraphQLEditorChoicesResponseSchema.safeParse(editorChoicesResult.data)
        const latestPostsValidation =
          GraphQLLatestPostsResponseSchema.safeParse(latestPostsResult.data)

        if (!editorChoicesValidation.success) {
          throw new Error(
            `GraphQL EditorChoices validation failed: ${JSON.stringify(
              editorChoicesValidation.error.issues
            )}`
          )
        }
        if (!latestPostsValidation.success) {
          throw new Error(
            `GraphQL LatestPosts validation failed: ${JSON.stringify(
              latestPostsValidation.error.issues
            )}`
          )
        }

        const validatedEditorChoices = editorChoicesValidation.data
        const validatedLatestPosts = latestPostsValidation.data

        const transformedGraphQLChoices =
          validatedEditorChoices.allEditorChoices.map((choice) => ({
            choice: {
              ...choice.choice,
              heroImage: choice.choice.heroImage || {
                imageApiData: {
                  url: '',
                },
              },
            },
          }))

        const transformedGraphQLPosts = validatedLatestPosts.allPosts.map(
          (post) => ({
            ...post,
            heroVideo: post.heroVideo
              ? {
                  coverPhoto: post.heroVideo?.coverPhoto || {
                    imageApiData: {
                      url: '',
                    },
                  },
                }
              : {
                  coverPhoto: {
                    imageApiData: {
                      url: '',
                    },
                  },
                },
          })
        )

        return {
          latest: transformedGraphQLPosts,
          choices: transformedGraphQLChoices as EditorChoices[],
          _allPostsMeta: validatedLatestPosts._allPostsMeta,
          source: 'graphql' as const,
        }
      }
    )
  } else {
    const client = getClient()

    const latestPostsResult = await client.query<{
      allPosts: PostWithCategory[]
      _allPostsMeta?: { count: number }
    }>({
      query: getPostsWithCategory,
      variables: {
        first,
        skip,
        withCount,
        filteredSlug,
      },
    })

    const latestPostsValidationResult =
      GraphQLLatestPostsResponseSchema.safeParse(latestPostsResult.data)

    if (!latestPostsValidationResult.success) {
      throw new Error(
        `GraphQL LatestPosts validation failed: ${JSON.stringify(
          latestPostsValidationResult.error.issues
        )}`
      )
    }

    const validatedLatestPosts = latestPostsValidationResult.data

    const transformedGraphQLPosts = validatedLatestPosts.allPosts.map(
      (post) => ({
        ...post,
        heroVideo: post.heroVideo
          ? {
              coverPhoto: post.heroVideo?.coverPhoto || {
                imageApiData: {
                  url: '',
                },
              },
            }
          : {
              coverPhoto: {
                imageApiData: {
                  url: '',
                },
              },
            },
      })
    )

    data = {
      latest: transformedGraphQLPosts,
      choices: [] as EditorChoices[],
      _allPostsMeta: validatedLatestPosts._allPostsMeta,
      source: 'graphql' as const,
    }
  }

  return { data }
}

// For aside section in category page
type QueryType = {
  allPosts: PostCardItem[]
}

const client = getClient()
const firstNItems = 5
const filteredSlugList: string[] = []
const queryArgs = {
  query: getLatestPosts,
  variables: {
    first: firstNItems,
    filteredSlug: filteredSlugList,
  },
}

/**
 * Fetches the latest 5 posts to be displayed in the aside section in category page.
 */
const getLatestPostsFunction = () => {
  return client.query<QueryType>(queryArgs)
}

export { getLatestPostsAndEditorChoices, getLatestPostsFunction }

'use server'
import errors from '@twreporter/errors'
import { z } from 'zod'
import { getClient } from '~/apollo-client'
import {
  type PostWithCategory,
  getPostsWithCategory,
  getLatestPosts,
} from '~/graphql/query/posts'
import {
  EditorChoices,
  fetchEditorChoices,
} from '~/graphql/query/editor-choices'

import { fetchStaticJson } from '~/utils/fetch-static-json'
import { createDataFetchingChain } from '~/utils/fetch-function'
import type { HeroImage } from '~/graphql/fragments/listing-post'
import type { FormattableHeroImage } from '~/types/hero-image'

const ImageApiDataSchema = z
  .object({
    url: z.string().optional(),
    original: z.object({ url: z.string() }).optional(),
    w2400: z.object({ url: z.string() }).optional(),
    w1600: z.object({ url: z.string() }).optional(),
    w1200: z.object({ url: z.string() }).optional(),
    w800: z.object({ url: z.string() }).optional(),
    w480: z.object({ url: z.string() }).optional(),
  })
  .passthrough()

const HeroImageObjectSchema = z
  .object({
    // K6 flat image format.
    original: z.string().optional(),
    w2400: z.string().optional(),
    w1600: z.string().optional(),
    w1200: z.string().optional(),
    w800: z.string().optional(),
    w480: z.string().optional(),
    // Legacy hero image fields still returned by some GraphQL responses.
    urlDesktopSized: z.string().optional(),
    urlTabletSized: z.string().optional(),
    urlMobileSized: z.string().optional(),
    urlTinySized: z.string().optional(),
    urlOriginal: z.string().optional(),
    // GraphQL / API image payload.
    imageApiData: z.union([z.string(), ImageApiDataSchema]).optional(),
  })
  .passthrough()

const StaticEditorChoiceSchema = z.object({
  name: z.string(),
  slug: z.string(),
  heroImage: z.string().nullable(),
  heroVideo: z
    .object({
      coverPhoto: HeroImageObjectSchema.nullable(),
    })
    .nullable()
    .optional(),
  source: z.string(),
  exclusive: z
    .preprocess((val) => {
      if (typeof val === 'boolean') return val
      if (val === 'true' || val === true) return true
      if (val === 'false' || val === false) return false
      return null
    }, z.boolean().nullable())
    .default(null),
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
  heroImage: z.string().nullable(),
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
      coverPhoto: HeroImageObjectSchema.nullable(),
    })
    .nullable()
    .optional(),
  exclusive: z
    .preprocess((val) => {
      if (typeof val === 'boolean') return val
      if (val === 'true' || val === true) return true
      if (val === 'false' || val === false) return false
      return null
    }, z.boolean().nullable())
    .default(null),
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
  heroImage: HeroImageObjectSchema.nullable(),
  exclusive: z
    .preprocess((val) => {
      if (typeof val === 'boolean') return val
      if (val === 'true' || val === true) return true
      if (val === 'false' || val === false) return false
      return null
    }, z.boolean().nullable())
    .default(null),
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
      coverPhoto: HeroImageObjectSchema.nullable(),
    })
    .nullable(),
})

const GraphQLEditorChoicesResponseSchema = z.object({
  allEditorChoices: z.array(
    z.object({
      choice: z.object({
        name: z.string(),
        slug: z.string(),
        heroImage: z.string().nullable(),
        heroVideo: z
          .object({
            coverPhoto: HeroImageObjectSchema.nullable(),
          })
          .nullable(),
        exclusive: z
          .preprocess((val) => {
            if (typeof val === 'boolean') return val
            if (val === 'true' || val === true) return true
            if (val === 'false' || val === false) return false
            return null
          }, z.boolean().nullable())
          .default(null),
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
  const jsonData = await fetchStaticJson(`latest_posts0${page}.json`)
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
    latest: PostWithCategory<string | HeroImage | null>[]
    choices: EditorChoices<string | HeroImage | null>[]
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
    latest: PostWithCategory<string | HeroImage | null>[]
    choices: EditorChoices<string | HeroImage | null>[]
    _allPostsMeta?: { count: number }
    source: 'json' | 'graphql'
  }

  if (jsonPage) {
    type JsonChainResult = {
      latest: PostWithCategory<string | null | HeroImage>[]
      choices: EditorChoices<string | HeroImage | null>[]
      _allPostsMeta?: { count: number }
      source: 'json' | 'graphql'
    }
    const fetchFromJson = async (): Promise<JsonChainResult> => {
      const validatedData = await fetchLatestPostsAndEditorChoices({
        page: jsonPage,
      })

      const transformedChoices = (validatedData.choices || []).map((choice) => {
        return {
          choice: {
            name: choice.name,
            slug: choice.slug,
            source: choice.source,
            heroImage: choice.heroImage,
            heroVideo: choice.heroVideo
              ? {
                  coverPhoto: choice.heroVideo.coverPhoto ?? null,
                }
              : null,
            exclusive: choice.exclusive ?? false,
          },
        }
      }) as EditorChoices<string | HeroImage | null>[]

      const transformedPosts = validatedData.latest.map((post) => {
        return {
          slug: post.slug,
          style: post.style,
          name: post.name,
          heroImage: post.heroImage,
          publishTime: new Date(post.publishTime),
          categories: (post.categories || []).map((category) => ({
            slug: category.slug || category.name?.toLowerCase() || 'unknown',
            name: category.name,
          })),
          heroVideo: post.heroVideo
            ? {
                coverPhoto:
                  (post.heroVideo.coverPhoto as FormattableHeroImage) ?? null,
              }
            : null,
          exclusive: post.exclusive,
          partner: post.partner,
        }
      })

      return {
        latest: transformedPosts,
        choices: transformedChoices,
        _allPostsMeta: withCount ? { count: 200 } : undefined,
        source: 'json',
      }
    }

    const fetchFromGraphQL = async (): Promise<JsonChainResult> => {
      const client = getClient()
      const [editorChoicesResult, latestPostsResult] = await Promise.all([
        client.query({
          query: fetchEditorChoices,
        }),
        client.query({
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
      const latestPostsValidation = GraphQLLatestPostsResponseSchema.safeParse(
        latestPostsResult.data
      )

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
            heroImage: choice.choice.heroImage,
            heroVideo: choice.choice.heroVideo
              ? {
                  coverPhoto:
                    (choice.choice.heroVideo
                      .coverPhoto as FormattableHeroImage) ?? null,
                }
              : null,
          },
        }))

      const transformedGraphQLPosts = validatedLatestPosts.allPosts.map(
        (post) => ({
          ...post,
          heroVideo: post.heroVideo
            ? {
                coverPhoto:
                  (post.heroVideo.coverPhoto as FormattableHeroImage) ?? null,
              }
            : null,
        })
      )

      return {
        latest: transformedGraphQLPosts as PostWithCategory<
          string | HeroImage | null
        >[],
        choices: transformedGraphQLChoices as EditorChoices<
          string | HeroImage | null
        >[],
        _allPostsMeta: validatedLatestPosts._allPostsMeta,
        source: 'graphql' as const,
      }
    }

    if (jsonPage > 1) {
      try {
        data = await fetchFromJson()
      } catch (err) {
        errorLogger(err)
        data = { latest: [], choices: [], source: 'json' as const }
      }
    } else {
      data = await createDataFetchingChain<JsonChainResult>(
        errorLogger,
        { latest: [], choices: [], source: 'graphql' as const },
        fetchFromJson as unknown as () => Promise<JsonChainResult>,
        fetchFromGraphQL
      )
    }
  } else {
    const latestPostsResult = await getClient().query({
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
              coverPhoto: post.heroVideo.coverPhoto ?? null,
            }
          : null,
      })
    ) as PostWithCategory<string | HeroImage | null>[]

    data = {
      latest: transformedGraphQLPosts,
      choices: [] as EditorChoices<string | HeroImage | null>[],
      _allPostsMeta: validatedLatestPosts._allPostsMeta,
      source: 'graphql' as const,
    }
  }

  return { data }
}

// For aside section in category page
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
  return getClient().query(queryArgs)
}

export { getLatestPostsAndEditorChoices, getLatestPostsFunction }

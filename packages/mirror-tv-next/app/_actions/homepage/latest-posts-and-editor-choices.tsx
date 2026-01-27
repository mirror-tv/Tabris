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

import { fetchStaticJson } from '~/utils/fetch-static-json'
import { createDataFetchingChain } from '~/utils/fetch-function'
import type { HeroImage } from '~/types/common'

// New JSON format schema (for latest_posts.json)
const NewHeroImageSchema = z.object({
  original: z.string().optional(),
  w1600: z.string().optional(),
  w1200: z.string().optional(),
  w800: z.string().optional(),
  w480: z.string().optional(),
})

// Legacy format schema (for GraphQL compatibility)
const LegacyHeroImageSchema = z.object({
  urlDesktopSized: z.string().optional(),
  urlTabletSized: z.string().optional(),
  urlMobileSized: z.string().optional(),
  urlTinySized: z.string().optional(),
  urlOriginal: z.string().optional(),
})

// Combined schema that accepts both formats
const HeroImageSchema = z.union([NewHeroImageSchema, LegacyHeroImageSchema])

const FlexibleHeroImageSchema = z.union([z.string(), HeroImageSchema, z.null()])

const StaticEditorChoiceSchema = z.object({
  name: z.string(),
  slug: z.string(),
  heroImage: FlexibleHeroImageSchema.optional(),
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
  heroImage: FlexibleHeroImageSchema.optional(),
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

/**
 * Convert new heroImage format { original, w1600, w1200, w800, w480 } to legacy format { urlOriginal, urlDesktopSized, urlTabletSized, urlMobileSized, urlTinySized }
 * Filters out empty strings and returns null if no valid URLs are found
 */
function convertHeroImageToLegacyFormat(
  heroImage: z.infer<typeof FlexibleHeroImageSchema>
): {
  urlOriginal?: string
  urlDesktopSized?: string
  urlTabletSized?: string
  urlMobileSized?: string
  urlTinySized?: string
} | null {
  if (!heroImage) {
    return null
  }

  // Handle string format
  if (typeof heroImage === 'string') {
    return heroImage.trim() ? { urlOriginal: heroImage.trim() } : null
  }

  // If it's already in legacy format, filter out empty strings
  if ('urlOriginal' in heroImage || 'urlDesktopSized' in heroImage) {
    const result: {
      urlOriginal?: string
      urlDesktopSized?: string
      urlTabletSized?: string
      urlMobileSized?: string
      urlTinySized?: string
    } = {}

    if (heroImage.urlOriginal?.trim()) {
      result.urlOriginal = heroImage.urlOriginal.trim()
    }
    if (heroImage.urlDesktopSized?.trim()) {
      result.urlDesktopSized = heroImage.urlDesktopSized.trim()
    }
    if (heroImage.urlTabletSized?.trim()) {
      result.urlTabletSized = heroImage.urlTabletSized.trim()
    }
    if (heroImage.urlMobileSized?.trim()) {
      result.urlMobileSized = heroImage.urlMobileSized.trim()
    }
    if (heroImage.urlTinySized?.trim()) {
      result.urlTinySized = heroImage.urlTinySized.trim()
    }

    return Object.keys(result).length > 0 ? result : null
  }

  // Convert new format to legacy format
  if ('original' in heroImage || 'w1600' in heroImage) {
    const result: {
      urlOriginal?: string
      urlDesktopSized?: string
      urlTabletSized?: string
      urlMobileSized?: string
      urlTinySized?: string
    } = {}

    // Only include non-empty strings
    if (heroImage.original?.trim()) {
      result.urlOriginal = heroImage.original.trim()
    }
    if (heroImage.w1600?.trim()) {
      result.urlDesktopSized = heroImage.w1600.trim()
    }
    if (heroImage.w1200?.trim()) {
      result.urlTabletSized = heroImage.w1200.trim()
    } else if (heroImage.w1600?.trim()) {
      result.urlTabletSized = heroImage.w1600.trim()
    }
    if (heroImage.w800?.trim()) {
      result.urlMobileSized = heroImage.w800.trim()
    }
    if (heroImage.w480?.trim()) {
      result.urlTinySized = heroImage.w480.trim()
    }

    return Object.keys(result).length > 0 ? result : null
  }

  return null
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
    type JsonChainResult = {
      latest: PostWithCategory[]
      choices: EditorChoices[]
      _allPostsMeta?: { count: number }
      source: 'json' | 'graphql'
    }
    const fetchFromJson = async (): Promise<JsonChainResult> => {
      const validatedData = await fetchLatestPostsAndEditorChoices({
        page: jsonPage,
      })

      const transformedChoices = (validatedData.choices || []).map((choice) => {
        let heroImage: HeroImage | null = null

        if (typeof choice.heroImage === 'string') {
          heroImage = { urlOriginal: choice.heroImage }
        } else if (choice.heroImage) {
          const converted = convertHeroImageToLegacyFormat(choice.heroImage)
          if (converted) {
            heroImage = converted as HeroImage
          }
        }

        const coverPhoto = choice.heroVideo?.coverPhoto
          ? (convertHeroImageToLegacyFormat(
              choice.heroVideo.coverPhoto
            ) as HeroImage | null)
          : null

        return {
          choice: {
            name: choice.name,
            slug: choice.slug,
            source: choice.source,
            heroImage: (heroImage || {
              urlOriginal: '',
              urlDesktopSized: '',
              urlTabletSized: '',
              urlMobileSized: '',
              urlTinySized: '',
            }) as HeroImage,
            heroVideo: choice.heroVideo
              ? {
                  coverPhoto: (coverPhoto || {
                    urlOriginal: '',
                    urlDesktopSized: '',
                    urlTabletSized: '',
                    urlMobileSized: '',
                    urlTinySized: '',
                  }) as HeroImage | null,
                }
              : {
                  coverPhoto: {
                    urlOriginal: '',
                    urlDesktopSized: '',
                    urlTabletSized: '',
                    urlMobileSized: '',
                    urlTinySized: '',
                  } as HeroImage,
                },
            exclusive: choice.exclusive ?? false,
          },
        }
      }) as EditorChoices[]

      const transformedPosts = validatedData.latest.map((post) => {
        let heroImage: HeroImage | null = null

        if (typeof post.heroImage === 'string') {
          heroImage = { urlOriginal: post.heroImage }
        } else if (post.heroImage) {
          const converted = convertHeroImageToLegacyFormat(post.heroImage)
          if (converted) {
            heroImage = converted as HeroImage
          }
        }

        const coverPhoto = post.heroVideo?.coverPhoto
          ? (convertHeroImageToLegacyFormat(
              post.heroVideo.coverPhoto
            ) as HeroImage | null)
          : null

        return {
          slug: post.slug,
          style: post.style,
          name: post.name,
          heroImage: heroImage as HeroImage | null,
          publishTime: new Date(post.publishTime),
          categories: (post.categories || []).map((category) => ({
            slug: category.slug || category.name?.toLowerCase() || 'unknown',
            name: category.name,
          })),
          heroVideo: {
            coverPhoto: (coverPhoto || {
              urlOriginal: '',
              urlDesktopSized: '',
              urlTabletSized: '',
              urlMobileSized: '',
              urlTinySized: '',
            }) as HeroImage | null,
          },
          exclusive: post.exclusive,
        } as PostWithCategory
      }) as PostWithCategory[]

      return {
        latest: transformedPosts as PostWithCategory[],
        choices: transformedChoices as EditorChoices[],
        _allPostsMeta: withCount ? { count: 200 } : undefined,
        source: 'json',
      } as JsonChainResult
    }
    data = await createDataFetchingChain<JsonChainResult>(
      errorLogger,
      { latest: [], choices: [], source: 'graphql' as const },
      fetchFromJson as unknown as () => Promise<JsonChainResult>,
      async (): Promise<JsonChainResult> => {
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
                urlOriginal: '',
                urlDesktopSized: '',
                urlTabletSized: '',
                urlMobileSized: '',
                urlTinySized: '',
              },
            },
          }))

        const transformedGraphQLPosts = validatedLatestPosts.allPosts.map(
          (post) => ({
            ...post,
            heroVideo: post.heroVideo
              ? {
                  coverPhoto: post.heroVideo?.coverPhoto || {
                    urlOriginal: '',
                    urlDesktopSized: '',
                    urlTabletSized: '',
                    urlMobileSized: '',
                    urlTinySized: '',
                  },
                }
              : {
                  coverPhoto: {
                    urlOriginal: '',
                    urlDesktopSized: '',
                    urlTabletSized: '',
                    urlMobileSized: '',
                    urlTinySized: '',
                  },
                },
          })
        )

        return {
          latest: transformedGraphQLPosts as PostWithCategory[],
          choices: transformedGraphQLChoices as EditorChoices[],
          _allPostsMeta: validatedLatestPosts._allPostsMeta,
          source: 'graphql' as const,
        } as JsonChainResult
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
                urlOriginal: '',
                urlDesktopSized: '',
                urlTabletSized: '',
                urlMobileSized: '',
                urlTinySized: '',
              },
            }
          : {
              coverPhoto: {
                urlOriginal: '',
                urlDesktopSized: '',
                urlTabletSized: '',
                urlMobileSized: '',
                urlTinySized: '',
              },
            },
      })
    ) as PostWithCategory[]

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

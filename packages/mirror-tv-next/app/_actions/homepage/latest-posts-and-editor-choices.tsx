'use server'
import errors from '@twreporter/errors'
import { z } from 'zod'
import { getClient } from '~/apollo-client'
import {
  type PostWithCategory,
  getPostsWithCategory,
} from '~/graphql/query/posts'
import {
  EditorChoices,
  fetchEditorChoices,
} from '~/graphql/query/editor-choices'

import { createDataFetchingChain } from '~/utils/fetch-function'

const HeroImageSchema = z.object({
  urlDesktopSized: z.string().optional(),
  urlTabletSized: z.string().optional(),
  urlMobileSized: z.string().optional(),
  urlTinySized: z.string().optional(),
  urlOriginal: z.string().optional(),
})

const StaticEditorChoiceSchema = z.object({
  name: z.string(),
  slug: z.string(),
  heroImage: HeroImageSchema.nullable(),
  heroVideo: z
    .object({
      coverPhoto: HeroImageSchema.nullable(),
    })
    .nullable(),
  source: z.string(),
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
  publishTime: z.string(),
  heroImage: z.union([z.string(), HeroImageSchema, z.null()]),
  categories: z
    .array(
      z.object({
        slug: z.string(),
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
})

const PostWithCategorySchema = ListingPostSchema.extend({
  publishTime: z.string().transform((val) => new Date(val)),
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
  const resp = await fetch(
    `https://storage.googleapis.com/static-mnews-tw-dev/files/json/latest_posts0${page}.json`
  )
  if (!resp.ok) {
    throw new Error(`HTTP error! status: ${resp.status}`)
  }
  const jsonData = await resp.json()
  return StaticHomepageResponseSchema.parse(jsonData)
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
      { latest: [], choices: [], source: 'json' as const },
      async () => {
        const validatedData = await fetchLatestPostsAndEditorChoices({
          page: jsonPage,
        })

        const transformedChoices = (validatedData.choices || []).map(
          (choice) => ({
            choice: {
              name: choice.name,
              slug: choice.slug,
              heroImage: choice.heroImage || {
                urlOriginal: '',
                urlDesktopSized: '',
                urlTabletSized: '',
                urlMobileSized: '',
                urlTinySized: '',
              },
              heroVideo: choice.heroVideo,
            },
          })
        )

        const transformedPosts = validatedData.latest.map((post) => ({
          slug: post.slug,
          style: post.style,
          name: post.name,
          heroImage:
            typeof post.heroImage === 'string'
              ? { urlOriginal: post.heroImage }
              : post.heroImage,
          publishTime: new Date(post.publishTime),
          categories: post.categories || [],
          heroVideo: {
            coverPhoto: post.heroVideo?.coverPhoto || {
              urlOriginal: '',
              urlDesktopSized: '',
              urlTabletSized: '',
              urlMobileSized: '',
              urlTinySized: '',
            },
          },
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

        const validatedEditorChoices = GraphQLEditorChoicesResponseSchema.parse(
          editorChoicesResult.data
        )
        const validatedLatestPosts = GraphQLLatestPostsResponseSchema.parse(
          latestPostsResult.data
        )

        // Transform GraphQL data to ensure heroImage is never null
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

        // Transform GraphQL data to ensure heroVideo is never null
        const transformedGraphQLPosts = validatedLatestPosts.allPosts.map(
          (post) => ({
            ...post,
            heroVideo: post.heroVideo
              ? {
                  coverPhoto: post.heroVideo.coverPhoto || {
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
          latest: transformedGraphQLPosts,
          choices: transformedGraphQLChoices,
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

    const validatedLatestPosts = GraphQLLatestPostsResponseSchema.parse(
      latestPostsResult.data
    )

    // Transform GraphQL data to ensure heroVideo is never null
    const transformedGraphQLPosts = validatedLatestPosts.allPosts.map(
      (post) => ({
        ...post,
        heroVideo: post.heroVideo
          ? {
              coverPhoto: post.heroVideo.coverPhoto || {
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

    data = {
      latest: transformedGraphQLPosts,
      choices: [], // 不抓取 editor choices
      _allPostsMeta: validatedLatestPosts._allPostsMeta,
      source: 'graphql' as const,
    }
  }

  return { data }
}

export { getLatestPostsAndEditorChoices }

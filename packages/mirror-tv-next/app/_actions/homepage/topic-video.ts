'use server'

import errors from '@twreporter/errors'
import { z } from 'zod'
import { HOMEPAGE_JSON_URL } from '~/constants/environment-variables'
import { createDataFetchingChain } from '~/utils/fetch-function'
import type { Video } from '~/graphql/query/videos'
import type { PromotionVideo } from '~/graphql/query/promotion-video'
import type { FeatureTopic } from '~/graphql/query/topic'

type VideoWithRequiredDescription = Omit<Video, 'description'> & {
  description: string
}

const HeroImageSchema = z.object({
  urlDesktopSized: z.string().optional(),
  urlTabletSized: z.string().optional(),
  urlMobileSized: z.string().optional(),
  urlTinySized: z.string().optional(),
  urlOriginal: z.string().optional(),
})

const TopicVideoDataSchema = z.object({
  allTopics: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      heroImage: HeroImageSchema.nullable(),
      sortDir: z.string().optional(),
      postDESC: z
        .array(
          z.object({
            slug: z.string(),
            name: z.string(),
          })
        )
        .optional(),
      postASC: z
        .array(
          z.object({
            slug: z.string(),
            name: z.string(),
          })
        )
        .optional(),
    })
  ),
  allVideos: z.array(
    z.object({
      id: z.string(),
      youtubeUrl: z.string(),
      url: z.string(),
      description: z.string().nullable().optional(),
    })
  ),
  allPromotionVideos: z.array(
    z.object({
      id: z.string(),
      ytUrl: z.string(),
    })
  ),
  timestamp: z.string().optional(),
})

async function fetchTopicVideoData() {
  const resp = await fetch(HOMEPAGE_JSON_URL)
  if (!resp.ok) {
    throw new Error(`HTTP error! status: ${resp.status}`)
  }
  const jsonData = await resp.json()
  return TopicVideoDataSchema.parse(jsonData)
}

async function getTopicVideo(): Promise<{
  data: {
    allTopics: FeatureTopic[]
    allVideos: VideoWithRequiredDescription[]
    allPromotionVideos: PromotionVideo[]
    source: 'json' | 'graphql'
  }
}> {
  const errorLogger = (err: unknown) => {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching topic video data'
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

  const data = await createDataFetchingChain<{
    allTopics: FeatureTopic[]
    allVideos: VideoWithRequiredDescription[]
    allPromotionVideos: PromotionVideo[]
    source: 'json' | 'graphql'
  }>(
    errorLogger,
    {
      allTopics: [],
      allVideos: [],
      allPromotionVideos: [],
      source: 'json' as const,
    },
    async () => {
      const validatedData = await fetchTopicVideoData()

      // Transform data to match component expectations
      const transformedTopics = validatedData.allTopics.map((topic) => ({
        ...topic,
        heroImage: topic.heroImage || {
          urlOriginal: '',
          urlDesktopSized: '',
          urlTabletSized: '',
          urlMobileSized: '',
          urlTinySized: '',
        },
        postDESC: topic.postDESC || [],
        postASC: topic.postASC || [],
      }))

      const transformedVideos = validatedData.allVideos.map((video) => ({
        ...video,
        description: video.description || '',
      })) as VideoWithRequiredDescription[]

      return {
        allTopics: transformedTopics,
        allVideos: transformedVideos,
        allPromotionVideos: validatedData.allPromotionVideos,
        source: 'json' as const,
      }
    },
    // TODO: Implement GraphQL fallback
    async () => {
      return {
        allTopics: [],
        allVideos: [],
        allPromotionVideos: [],
        source: 'graphql' as const,
      }
    }
  )

  return { data }
}

export { getTopicVideo }

'use server'

import errors from '@twreporter/errors'
import { z } from 'zod'
import {
  HOMEPAGE_TOPIC_JSON_URL,
  HOMEPAGE_VIDEO_JSON_URL,
} from '~/constants/environment-variables'
import { createDataFetchingChain } from '~/utils/fetch-function'
import type { Video } from '~/graphql/query/videos'
import type { PromotionVideo } from '~/graphql/query/promotion-video'
import type { FeatureTopic } from '~/graphql/query/topic'

type VideoWithRequiredDescription = Omit<Video, 'description'> & {
  description: string
}

// New JSON format schema (for topic.json)
const NewHeroImageSchema = z.object({
  w480: z.string().optional(),
  w800: z.string().optional(),
  original: z.string().optional(),
})

const TopicItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  heroImage: NewHeroImageSchema.nullable(),
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

const TopicDataSchema = z.object({
  topics: z.array(TopicItemSchema).optional(),
  allTopics: z.array(TopicItemSchema).optional(), // Backward compatibility
  timestamp: z.string().optional(),
})

/** Matches video.json: videos[].id,name,youtubeUrl,url,description,createdAt; promotionVideos[].id,ytUrl; timestamp? */
const VideoItemSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  youtubeUrl: z.string(),
  url: z.string(),
  description: z.string().optional(),
  createdAt: z.string().optional(),
})

const PromotionVideoItemSchema = z.object({
  id: z.string(),
  ytUrl: z.string(),
})

const VideoDataSchema = z.object({
  videos: z.array(VideoItemSchema).optional(),
  allVideos: z.array(VideoItemSchema).optional(), // Backward compatibility
  promotionVideos: z.array(PromotionVideoItemSchema).optional(),
  allPromotionVideos: z.array(PromotionVideoItemSchema).optional(), // Backward compatibility
  timestamp: z.string().optional(),
})

async function fetchTopicData() {
  const resp = await fetch(HOMEPAGE_TOPIC_JSON_URL)
  if (!resp.ok) {
    throw new Error(`HTTP error! status: ${resp.status}`)
  }
  const jsonData = await resp.json()
  return TopicDataSchema.parse(jsonData)
}

async function fetchVideoData() {
  const resp = await fetch(HOMEPAGE_VIDEO_JSON_URL)
  if (!resp.ok) {
    throw new Error(`HTTP error! status: ${resp.status}`)
  }
  const jsonData = await resp.json()
  return VideoDataSchema.parse(jsonData)
}

/**
 * Convert new heroImage format { w480, w800, original } to HeroImage format { urlOriginal, urlMobileSized, urlTabletSized }
 */
function convertHeroImageToLegacyFormat(
  heroImage: z.infer<typeof NewHeroImageSchema> | null
): {
  urlOriginal?: string
  urlMobileSized?: string
  urlTabletSized?: string
} | null {
  if (!heroImage) {
    return null
  }

  return {
    urlOriginal: heroImage.original,
    urlMobileSized: heroImage.w800,
    urlTabletSized: heroImage.w800,
  }
}

async function fetchTopicVideoData() {
  const [topicData, videoData] = await Promise.all([
    fetchTopicData(),
    fetchVideoData(),
  ])

  // Support both new format (topics) and old format (allTopics)
  const topics = topicData.topics || topicData.allTopics || []

  // Support both new format (videos, promotionVideos) and old format (allVideos, allPromotionVideos)
  const videos = videoData.videos || videoData.allVideos || []
  const promotionVideos =
    videoData.promotionVideos || videoData.allPromotionVideos || []

  return {
    allTopics: topics,
    allVideos: videos,
    allPromotionVideos: promotionVideos,
  }
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
        id: topic.id,
        slug: topic.slug,
        name: topic.name,
        sortDir: topic.sortDir,
        heroImage: convertHeroImageToLegacyFormat(topic.heroImage),
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

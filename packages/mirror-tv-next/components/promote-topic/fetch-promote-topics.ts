import { z } from 'zod'
import { STATIC_BASE_URL } from '~/constants/endpoint-config'
import { PROMOTE_TOPICS_FILENAME } from '~/constants/json-filenames'
import type { PromoteTopicData } from '~/types/promote-topic'
import { createErrorLogger } from '~/utils/log'

const imageSetSchema = z
  .record(z.string(), z.string())
  .transform((images) =>
    Object.values(images).some(Boolean) ? images : undefined
  )

const promoteTopicsSchema = z.object({
  promoteTopics: z.array(
    z.object({
      id: z.union([z.string(), z.number()]).transform(String),
      order: z.number().nullable().optional(),
      topics: z
        .object({
          slug: z.string().optional(),
          name: z.string().optional(),
          heroImage: z
            .object({
              resized: imageSetSchema.optional(),
              resizedWebp: imageSetSchema.optional(),
            })
            .nullable()
            .optional(),
        })
        .nullable()
        .optional(),
    })
  ),
  timestamp: z.string().optional(),
})

type PromoteTopicsResponse = z.infer<typeof promoteTopicsSchema>
type PromoteTopicItem = PromoteTopicsResponse['promoteTopics'][number]

function normalizePromoteTopic(
  item: PromoteTopicItem
): PromoteTopicData | null {
  const topic = item.topics
  const heroImage = topic?.heroImage
  const resized = heroImage?.resized
  const resizedWebp = heroImage?.resizedWebp

  if (!topic?.slug || !topic.name || (!resized && !resizedWebp)) {
    return null
  }

  return {
    id: item.id,
    order: item.order ?? null,
    slug: topic.slug,
    name: topic.name,
    heroImage: {
      resized,
      resizedWebp,
    },
  }
}

function normalizePromoteTopics(
  promoteTopics: PromoteTopicItem[]
): PromoteTopicData[] {
  return promoteTopics.reduce<PromoteTopicData[]>((topics, item) => {
    const topic = normalizePromoteTopic(item)

    if (topic) {
      topics.push(topic)
    }

    return topics
  }, [])
}

async function fetchPromoteTopics(): Promise<PromoteTopicData[]> {
  const errorLogger = createErrorLogger(
    'Error occurs while fetching promote topics'
  )

  try {
    const url = `${STATIC_BASE_URL}/json/${PROMOTE_TOPICS_FILENAME}`
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)
    }

    const data = promoteTopicsSchema.parse(await res.json())
    return normalizePromoteTopics(data.promoteTopics).sort(
      (a, b) => (a.order ?? Infinity) - (b.order ?? Infinity)
    )
  } catch (error) {
    errorLogger(error)
    return []
  }
}

export { fetchPromoteTopics }

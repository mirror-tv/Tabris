'use server'
import errors from '@twreporter/errors'
import { z } from 'zod'
import {
  CATEGORY_VIDEO_JSON_URL,
  GLOBAL_CACHE_SETTING,
} from '~/constants/environment-variables'
import type { PostCardItem } from '~/graphql/query/posts'
import type { FormattableHeroImage } from '~/types/hero-image'

type FetchMoreItemsType = {
  page: number
  categorySlug: string
  pageSize: number
  isWithCount: boolean
}

const CategoryVideoPostSchema = z.object({
  id: z.string(),
  heroImage: z
    .object({
      w480: z.string().optional(),
      w800: z.string().optional(),
    })
    .nullable(),
  name: z.string(),
  publishTime: z.string(),
  slug: z.string(),
  source: z.string().optional(),
})

const CategoryVideoCategorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().nullable().optional(),
  updatedAt: z.string().optional(),
  createdAt: z.string().optional(),
  posts: z.array(CategoryVideoPostSchema),
})

const CategoryVideoDataSchema = z.object({
  categories: z.array(CategoryVideoCategorySchema),
})

export type CategoryVideoCategory = z.infer<typeof CategoryVideoCategorySchema>

function postJsonToPostCardItem(
  post: z.infer<typeof CategoryVideoPostSchema>
): PostCardItem {
  const hero: FormattableHeroImage =
    post.heroImage && (post.heroImage.w480 || post.heroImage.w800)
      ? {
          w480: post.heroImage.w480,
          w800: post.heroImage.w800,
        }
      : {}

  return {
    slug: post.slug,
    name: post.name,
    publishTime: post.publishTime,
    heroImage: hero,
    exclusive: null,
    style: 'videoNews',
    __typename: 'Post',
  }
}

async function fetchCategoryVideoJson(): Promise<
  z.infer<typeof CategoryVideoDataSchema>
> {
  const resp = await fetch(CATEGORY_VIDEO_JSON_URL, {
    next: { revalidate: GLOBAL_CACHE_SETTING },
  })
  if (!resp.ok) {
    throw new Error(`category video json HTTP ${resp.status}`)
  }
  const json = await resp.json()
  return CategoryVideoDataSchema.parse(json)
}

/** sortOrder 升冪；null 排在最後 */
function sortCategoriesForVideoPage(
  categories: CategoryVideoCategory[]
): CategoryVideoCategory[] {
  return [...categories].sort((a, b) => {
    const ao = a.sortOrder ?? Number.MAX_SAFE_INTEGER
    const bo = b.sortOrder ?? Number.MAX_SAFE_INTEGER
    if (ao !== bo) return ao - bo
    return a.name.localeCompare(b.name, 'zh-Hant')
  })
}

async function fetchVideoPostsItems({
  page,
  categorySlug,
  pageSize,
  isWithCount,
}: FetchMoreItemsType): Promise<{
  categorySlug: string
  data: {
    allPosts: PostCardItem[]
    _allPostsMeta?: { count: number }
  }
}> {
  try {
    const parsed = await fetchCategoryVideoJson()
    const category = parsed.categories.find((c) => c.slug === categorySlug)
    const allPostsRaw = category?.posts ?? []
    const allPosts = allPostsRaw.map(postJsonToPostCardItem)
    const skip = page * pageSize
    const slice = allPosts.slice(skip, skip + pageSize)

    return {
      categorySlug,
      data: {
        allPosts: slice,
        _allPostsMeta: isWithCount ? { count: allPosts.length } : undefined,
      },
    }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching video posts data in category video page'
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
    throw annotatingError
  }
}

export {
  fetchVideoPostsItems,
  fetchCategoryVideoJson,
  sortCategoriesForVideoPage,
  postJsonToPostCardItem,
}

import errors from '@twreporter/errors'
import axios from 'axios'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { getClient } from '~/apollo-client'
import GptPopup from '~/components/ads/gpt/gpt-popup'
import { fetchPostsItems } from '~/components/category/action'
import PostsListManager from '~/components/category/posts-list-manager'
import UiFeaturePost from '~/components/category/ui-feature-post'
import UiHeadingBordered from '~/components/shared/ui-heading-bordered'
import {
  FEATURE_POSTS_URL,
  GLOBAL_CACHE_SETTING,
  SITE_URL,
} from '~/constants/environment-variables'
import { Category, fetchCategoryBySlug } from '~/graphql/query/category'
import type { Sale } from '~/graphql/query/sales'
import { getSales } from '~/graphql/query/sales'
import styles from '~/styles/pages/category.module.scss'
import { FeaturePost } from '~/types/api-data'
import {
  FormattedPostCard,
  formatArticleCard,
  formateDateAtTaipei,
} from '~/utils'
const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))
// import GPTAdStatic from '~/components/ads/gpt/gpt-ad'

export const revalidate = GLOBAL_CACHE_SETTING

async function fetchCategoryData(slug: string): Promise<Category> {
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

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const { slug } = params
  const categoryData = await fetchCategoryData(slug)

  return {
    metadataBase: new URL(SITE_URL),
    title: `${categoryData.name} - 鏡新聞`,
    openGraph: {
      title: `${categoryData.name} - 鏡新聞`,
      images: {
        url: '/images/default-og-img.jpg',
      },
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const PAGE_SIZE = 12
  let categoryData: Category = { name: '', slug: '' }
  let postsCount: number = 0
  let categoryPosts: FormattedPostCard[] = []
  let salePosts: FormattedPostCard[] = []
  let featurePost: FeaturePost | null = null

  categoryData = await fetchCategoryData(params.slug)
  if (!categoryData.name) return notFound()

  const client = getClient()
  try {
    const { data } = await client.query<{
      allSales: Sale[]
    }>({
      query: getSales,
      variables: {
        first: 4,
      },
    })
    salePosts =
      data?.allSales?.map((sale) =>
        formatArticleCard(sale?.adPost, { label: '特企' })
      ) ?? []
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching sale posts data in category page'
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

  try {
    const {
      data: { allPosts },
    } = await axios.get(FEATURE_POSTS_URL)
    featurePost = allPosts.find((post: FeaturePost) =>
      post.categories.some((category) => category.name === categoryData.name)
    )
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching feature posts data in category page'
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

  try {
    const { allPosts, _allPostsMeta } = await fetchPostsItems({
      page: 0,
      categorySlug: categoryData.slug,
      pageSize: PAGE_SIZE,
      isWithCount: true,
      filteredSlug: featurePost ? [featurePost.slug] : [],
    })
    postsCount = _allPostsMeta?.count ?? 0
    categoryPosts = allPosts.map((post) => formatArticleCard(post)) ?? []
    if (featurePost) {
      categoryPosts.unshift(formatArticleCard(featurePost))
    }
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
  }

  const postJsonData = categoryPosts?.slice(5).map((post, index) => {
    return {
      '@type': 'ListItem',
      position: index + 1 + '',
      item: {
        '@type': 'NewsArticle',
        url: `https://www.mnews.tw${post.href}`,
        headline: post.name,
        image: post.images.w3200 ?? post.images.original,
        dateCreated: formateDateAtTaipei(
          post.publishTime,
          'YYYY.MM.DD HH:mm',
          ''
        ),
      },
    }
  })

  const salesLength = salePosts?.length || 0
  const salesPostsInsertIndex = [2, 4, 8, 10].slice(0, salesLength)
  const renderedPostsListInit: FormattedPostCard[] = [...categoryPosts.slice(1)]

  if (salesLength) {
    salesPostsInsertIndex.forEach((position, index) => {
      renderedPostsListInit.splice(
        position,
        0,
        salePosts[salesLength - 1 - index]
      )
    })
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: '5',
    itemListElement: postJsonData,
  }

  return (
    <section className={styles.postsList}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GptPopup adKey="MB_CATEGORY" />
      <UiHeadingBordered title={categoryData.name} />
      {postsCount !== 0 && (
        <div className={`${styles.listWrapper} list-latest-wrapper`}>
          <UiFeaturePost post={categoryPosts[0]} />
          <PostsListManager
            categorySlug={categoryData.slug}
            pageSize={PAGE_SIZE}
            postsCount={postsCount}
            initPostsList={renderedPostsListInit}
            filteredSlug={featurePost ? [featurePost.slug] : []}
          />
        </div>
      )}
      <div className={styles.gptContainer}>
        <div className={styles.gptWrapper}>
          <GPTAd pageKey="category" adKey="PC_BT" />
        </div>
      </div>
    </section>
  )
}

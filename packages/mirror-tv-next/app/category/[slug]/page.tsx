import errors from '@twreporter/errors'
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
  GLOBAL_CACHE_SETTING,
  SITE_URL,
} from '~/constants/environment-variables'
import { Category, fetchCategoryBySlug } from '~/graphql/query/category'
import type { Sale } from '~/graphql/query/sales'
import { getSales } from '~/graphql/query/sales'
import styles from '~/styles/pages/category.module.scss'
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
    const { allPosts, _allPostsMeta } = await fetchPostsItems({
      page: 0,
      salePostsCount: salePosts?.length ?? 0,
      categorySlug: categoryData.slug,
      pageSize: PAGE_SIZE,
      isWithCount: true,
    })
    postsCount = _allPostsMeta?.count ?? 0
    categoryPosts = allPosts.map((post) => formatArticleCard(post)) ?? []
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
            salePostsList={salePosts}
            categorySlug={categoryData.slug}
            pageSize={PAGE_SIZE}
            postsCount={postsCount}
            initPostsList={categoryPosts.slice(1)}
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

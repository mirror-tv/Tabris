import type { Post } from '~/graphql/query/ombuds'
import { fetchOmbudsPosts } from '~/app/_actions/ombud'
import SwiperManager from './swiperManager'
import styles from './_styles/fetchArticleData-pc.module.scss'

export default async function tabletFetchArticleData() {
  const PAGE_SIZE = 12
  const filteredSlugArr: string[] = [
    'biography',
    'complaint',
    'reports',
    'law',
    'standards',
    'faq',
  ]
  const countOrNot: boolean = true
  let postsList: Post[] = []
  let nextPageDependment: number = 0

  try {
    const postsData = await fetchOmbudsPosts({
      page: 1,
      pageSize: PAGE_SIZE,
      slug: filteredSlugArr,
      isWithCount: countOrNot,
    })

    postsList = postsData.allPosts
    nextPageDependment = postsData._allPostsMeta.count
  } catch (error) {
    console.error('Error fetching Ombuds Articles:', error)
  }

  return (
    <div className={styles.articleList}>
      <h3>公評人辦公室最新消息</h3>
      <SwiperManager
        initialPostItems={postsList}
        slug={filteredSlugArr}
        countNumber={nextPageDependment}
        pageSize={PAGE_SIZE}
      />
    </div>
  )
}

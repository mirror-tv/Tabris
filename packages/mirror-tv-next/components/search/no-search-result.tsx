import Image from 'next/image'
import styles from './_styles/no-search-result.module.scss'
import { formatePostImage } from '~/utils'
import type { FormattedPostCard } from '~/utils'
import type { PopularSearchItem } from '~/types/api-data'
import type { PostCardItem } from '~/graphql/query/posts'
import NoSearchResultList from './no-search-result-list'
import { fetchPopularPosts } from '../errors/action'
type NoSearchResultProps = {
  keyword: string
}

const NoSearchResult = async ({ keyword }: NoSearchResultProps) => {
  let popularPostList: PopularSearchItem[] = []
  try {
    const { data } = await fetchPopularPosts()
    popularPostList = data.report
  } catch (e) {
    console.error('popularPostList_error', e)
  }
  const formatArticleCard = (articleCardList: PopularSearchItem) => {
    return {
      href: `/story/${articleCardList.slug}`,
      slug: articleCardList.slug,
      name: articleCardList.name,
      // TODO: turn formatePostImage into formateHeroImage
      images: formatePostImage(articleCardList as PostCardItem),
      publishTime: new Date(articleCardList.publishTime),
    }
  }

  const formattedPosts: FormattedPostCard[] =
    popularPostList.map(formatArticleCard)

  return (
    <main className={styles.main}>
      <div>
        <Image
          src="/images/tv-man.svg"
          alt="查無結果"
          width={166}
          height={204}
          className={styles.noResultImg}
        />
      </div>
      <section className={styles.noResultTxt}>
        <p>您搜尋的「{keyword}」</p>
        <p>查無相關結果</p>
      </section>
      <div className={styles.borderdHeadingWrapper}>
        <p>熱門新聞</p>
      </div>
      <div className={styles.divider} />
      <NoSearchResultList formattedPosts={formattedPosts} />
    </main>
  )
}

export default NoSearchResult

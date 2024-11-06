'use client'
import Image from 'next/image'
import styles from './_styles/no-search-result.module.scss'
import type { FormattedPostCard } from '~/utils'
import NoSearchResultList from './no-search-result-list'
import { useData } from '~/context/data-context'
import { formatArticleCard } from '~/utils'

type NoSearchResultProps = {
  keyword: string
}

const NoSearchResult = ({ keyword }: NoSearchResultProps) => {
  const { popularPosts } = useData()
  const formattedPosts: FormattedPostCard[] = popularPosts.map((post) =>
    formatArticleCard(post)
  )

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

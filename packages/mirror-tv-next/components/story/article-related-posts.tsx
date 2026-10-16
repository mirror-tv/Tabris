'use client'
import UiHeadingBordered from '../shared/ui-heading-bordered'

import styles from './_styles/article-related-posts.module.scss'
import { useMemo } from 'react'

type RelatedArticleItem = {
  slug: string
  name: string
  type?: 'post' | 'external'
}

const ArticleRelatedPosts = ({
  relatedPosts,
}: {
  relatedPosts: RelatedArticleItem[]
}) => {
  const hasRelatedPosts = useMemo(() => {
    return !!relatedPosts?.length
  }, [relatedPosts])

  if (!hasRelatedPosts) return null

  return (
    <div className={`${styles.container} list-wrapper post__related`}>
      <UiHeadingBordered title={'更多新聞'} className={styles.listTitle} />
      <ul className={styles.list}>
        {relatedPosts.map((item, idx) => (
          <a
            key={item.slug + idx}
            className={`ga-article-related ${styles.item}`}
            href={
              item.type === 'external'
                ? `/external/${item.slug}`
                : `/story/${item.slug}`
            }
            target="_blank"
            rel="noreferrer noopener"
          >
            {item.name}
          </a>
        ))}
      </ul>
    </div>
  )
}

export default ArticleRelatedPosts

'use client'
import { useState } from 'react'
import UiLoadMoreButton from '~/components/shared/ui-load-more-button'
import { fetchTopicItems } from '~/components/topic/single-topic/action'
import type { Post } from '~/graphql/query/topic'
import styles from './_styles/more-items-manager.module.scss'
import UiPostCard from './ui-post-card'

type Props = {
  slug: string
  itemsCount: number
  initialPostItems: Post[]
  sortBy: string
}

export default function MoreItemsManager({
  slug,
  itemsCount,
  initialPostItems,
  sortBy,
}: Props) {
  const pageSize = 12

  const [page, setPage] = useState(2)
  const [postsList, setPostsList] = useState<Post[]>([...initialPostItems])

  const handleClickLoadMore = async () => {
    const { items: newPosts } = await fetchTopicItems({
      page,
      pageSize,
      slug,
      sortBy,
    })
    if (!newPosts) return
    setPage((page) => page + 1)
    setPostsList((prevPosts) => [...prevPosts, ...newPosts])
  }

  return (
    <div className="topic__content">
      <ul className={styles.postItemWrapper}>
        {postsList.map((item, index) => (
          <li key={index}>
            <UiPostCard item={item} />
          </li>
        ))}
      </ul>
      {itemsCount > pageSize * (page - 1) && (
        <div className={styles.btnWrapper}>
          <UiLoadMoreButton title="看更多" onClick={handleClickLoadMore} />
        </div>
      )}
    </div>
  )
}

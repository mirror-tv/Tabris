'use client'
import { useState } from 'react'
import UiPostCard from './ui-post-card'
import type { Post } from '~/graphql/query/ombuds'
import { fetchOmbudsPosts } from '../../app/_actions/ombud'
import styles from './_styles/more-items-manager.module.scss'

type Props = {
  slug: string[]
  isWithCount: boolean
  initialPostItems: Post[]
  countNumber: number
}

export default function MoreItemsManager({
  initialPostItems,
  slug,
  isWithCount,
  countNumber,
}: Props) {
  const pageSize = 5

  const [page, setPage] = useState(2)
  const [postsList, setPostsList] = useState<Post[]>([...initialPostItems])

  const handleClickLoadMore = async () => {
    const nextPagedata = await fetchOmbudsPosts({
      page,
      pageSize,
      slug,
      isWithCount,
    })

    const nextPagePosts = nextPagedata.allPosts

    if (!nextPagePosts) return
    setPage((page) => page + 1)
    setPostsList((prevPosts) => [...prevPosts, ...nextPagePosts])
  }
  return (
    <div className="article-list__wrappe">
      <ul>
        {postsList.map((item, index) => (
          <li key={index}>
            <UiPostCard item={item} />
          </li>
        ))}
      </ul>
      {countNumber > pageSize * (page - 1) && (
        <button className={styles.loadMoreButton} onClick={handleClickLoadMore}>
          看更多
        </button>
      )}
    </div>
  )
}

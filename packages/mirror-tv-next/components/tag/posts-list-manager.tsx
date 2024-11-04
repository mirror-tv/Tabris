'use client'
import { useState } from 'react'
import UiPostCard from '~/components/shared/ui-post-card'
import { fetchPostsItems } from '~/app/_actions/tag'
import { PostCardItem } from '~/graphql/query/posts'
import styles from './_styles/posts-list-manager.module.scss'
import { formatArticleCard } from '~/utils'
import UiLoadMoreButton from '../shared/ui-load-more-button'

type PostsListManagerProps = {
  tagName: string
  pageSize: number
  postsCount: number
  initPostsList: PostCardItem[]
}

export default function PostsListManager({
  tagName,
  pageSize,
  postsCount,
  initPostsList,
}: PostsListManagerProps) {
  const [page, setPage] = useState(1)
  const [postsList, setPostsList] = useState<PostCardItem[]>([...initPostsList])

  const formattedPostsList = (list: PostCardItem[]) =>
    list.map((post) => formatArticleCard(post))

  const handleClickLoadMore = async () => {
    const { allPosts: newPosts } = await fetchPostsItems({
      page,
      tagName,
      pageSize,
      isWithCount: false,
    })
    if (!newPosts) return
    setPage((page) => page + 1)
    setPostsList((oldPost) => [...oldPost, ...newPosts])
  }

  return (
    <>
      <section className={styles.list}>
        <ol className={styles.posts}>
          {formattedPostsList(postsList)?.map((postItem) => {
            return (
              <li key={postItem.slug} className="list-handler__item">
                <UiPostCard
                  href={postItem.href}
                  images={postItem.images}
                  title={postItem.name}
                  date={postItem.publishTime}
                  postStyle={postItem.style}
                  mobileLayoutDirection="column"
                />
              </li>
            )
          })}
        </ol>
      </section>
      {postsCount > pageSize * page && (
        <div className={styles.btnWrapper}>
          <UiLoadMoreButton title="看更多" onClick={handleClickLoadMore} />
        </div>
      )}
    </>
  )
}

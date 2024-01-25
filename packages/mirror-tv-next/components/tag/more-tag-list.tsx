'use client'

import { useEffect, useState } from 'react'
import UiLoadMoreButton from '../shared/ui-load-more-button'
import { fetchMoreItems } from './action'

type UiMoreTagListProps = {
  tagName: string
  pageSize: number
}

export default function UiMoreTagList({
  tagName,
  pageSize,
}: UiMoreTagListProps) {
  const [page, setPage] = useState(1)

  const [posts, setPosts] = useState([])

  useEffect(() => {
    const updatePosts = async () => {
      const updatePosts = await fetchMoreItems()
      setPosts(updatePosts)
    }

    updatePosts()
  }, [])

  return (
    <section>
      <UiLoadMoreButton
        title="看更多"
        onClick={async () => {
          setPage((prevPage) => prevPage + 1)
          await fetchMoreItems(page)
        }}
      />
      <p>{posts}</p>
    </section>
  )
}

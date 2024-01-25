'use client'

import { useState } from 'react'
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

  return (
    <section>
      <UiLoadMoreButton
        title="看更多"
        onClick={async () => {
          setPage((prevPage) => prevPage + 1)
          await fetchMoreItems(page)
        }}
      />
    </section>
  )
}

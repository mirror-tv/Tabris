import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'

type Children<ItemType> = (renderList: ItemType[]) => React.JSX.Element

interface InfiniteScrollListProps<ItemType> {
  initialList?: ItemType[]
  pageSize: number
  fetchListInPage: (page: number) => Promise<ItemType[]>
  children: Children<ItemType>
  loader: React.JSX.Element
  totalCount: number
}

export default function InfiniteScrollList<ItemType>({
  initialList = [],
  pageSize,
  fetchListInPage,
  children,
  totalCount,
  loader,
}: InfiniteScrollListProps<ItemType>): React.JSX.Element {
  const [dataList, setDataList] = useState([...initialList])
  const initialPage = initialList.length ? 1 : 0
  const [fetchedPage, setFetchPage] = useState(initialPage)
  const [renderCount, setRenderCount] = useState(pageSize)
  const renderList = dataList.slice(0, renderCount)
  const [isLoading, setIsLoading] = useState(false)

  const totalPage = Math.ceil(totalCount / pageSize)

  const hasUnFetchedData = useMemo(
    () => !(renderCount >= dataList.length && fetchedPage >= totalPage),
    [dataList.length, renderCount, fetchedPage, totalPage]
  )
  const isNotEnoughToRender =
    fetchedPage < totalPage && dataList.length - renderCount <= pageSize

  const handleLoadMore = useCallback(() => {
    if (isLoading) {
      return
    }

    if (isNotEnoughToRender) {
      const newPage = fetchedPage + 1
      setIsLoading(true)
      fetchListInPage(newPage).then((newList) => {
        if (newList && Array.isArray(newList)) {
          setDataList((oldList) => [...oldList, ...newList])
        }
        setFetchPage(newPage)
        setIsLoading(false)
      })
    }
    setRenderCount((pre) => (pre += pageSize))
  }, [fetchListInPage, fetchedPage, pageSize, isLoading, isNotEnoughToRender])

  const loaderRef = useRef(null)

  useEffect(() => {
    const callback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (hasUnFetchedData) {
            handleLoadMore()
          } else {
            observer.unobserve(entry.target)
          }
        }
      })
    }

    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    })

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [hasUnFetchedData, handleLoadMore])

  return (
    <div>
      {children(renderList)}

      <div ref={loaderRef}>{hasUnFetchedData && loader}</div>
    </div>
  )
}

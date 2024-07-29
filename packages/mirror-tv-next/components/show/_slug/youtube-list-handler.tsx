'use client'
import useWindowDimensions from '~/hooks/use-window-dimensions'

import YoutubeList from './youtube-list'
import type { FormatPlayListItems } from './youtube-list'
import { useMemo, useState } from 'react'
import styles from './_styles/youtube-list-handler.module.scss'
import { fetchYoutubeList } from './action-yt'
import { formateYoutubeListRes } from '~/utils'

type YoutubeListHandlerProps = {
  playLists: FormatPlayListItems[]
}

export default function YoutubeListHandler({
  playLists = [],
}: YoutubeListHandlerProps) {
  const [activeList, setActiveList] = useState(0)
  const [listData, setListData] = useState(playLists)
  const { width } = useWindowDimensions()
  const isMobile = useMemo(() => {
    return width && width < 768
  }, [width])

  const fetchMoreItems = async (index: number) => {
    const response = await fetchYoutubeList({
      list: {
        id: listData[index].id,
        nextPageToken: listData[index].nextPageToken ?? '',
      },
      take: 30,
    })
    const formattedResponse = formateYoutubeListRes(response)
    const { items = [], nextPageToken = '' } = formattedResponse
    setListData((prev) => {
      const newData = [...prev]
      newData[index].items?.push(...items)
      newData[index].nextPageToken = nextPageToken
      return newData
    })
  }

  return (
    <>
      {listData.length > 1 && isMobile && (
        <div className={styles.toggleWrapper}>
          {listData.map((list, index) => {
            return (
              <button
                className={`${styles.toggle} ${
                  activeList === index ? styles.active : ''
                }`}
                onClick={() => setActiveList(index)}
                key={index}
              >
                {list.name}
              </button>
            )
          })}
        </div>
      )}

      {listData.map((list, index) => {
        return (
          list.items?.length && (
            <YoutubeList
              key={index}
              playListObj={list}
              fetchMoreItems={() => fetchMoreItems(index)}
              isShown={!isMobile || index === activeList}
            />
          )
        )
      })}
    </>
  )
}

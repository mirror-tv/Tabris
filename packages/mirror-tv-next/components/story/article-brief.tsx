'use client'
import { useState, useEffect } from 'react'
import styles from './_styles/article-brief.module.scss'
import ApiDataRenderer from './api-data-renderer/renderer'
import type { ApiData } from '~/types/api-data'

type ArticleBriefProps = {
  brief: string | ApiData[] | Array<{ id: string; content: string }>
}

export default function ArticleBrief({ brief }: ArticleBriefProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const isBriefString = typeof brief === 'string'

  if (!isMounted) {
    return null
  }

  return (
    <div className={styles.briefWrapper}>
      {isBriefString ? (
        <p className={styles.brief}>{brief}</p>
      ) : (
        <ApiDataRenderer
          contentData={JSON.stringify(brief)}
          isStoryBrief={true}
        />
      )}
    </div>
  )
}

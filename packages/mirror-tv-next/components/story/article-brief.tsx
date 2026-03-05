import styles from './_styles/article-brief.module.scss'
import ApiDataRenderer from './api-data-renderer/renderer'

type ArticleBriefProps = {
  brief: string | Array<{ id: string; content: string }>
}

/** 前言：SSR 渲染，首屏 HTML 即包含內容，利於 LCP */
export default function ArticleBrief({ brief }: ArticleBriefProps) {
  const isBriefString = typeof brief === 'string'

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

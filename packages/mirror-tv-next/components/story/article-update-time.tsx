import React from 'react'
import styles from './_styles/article-update-time.module.scss'

interface ArticleUpdateTimeProps {
  updateTime: string | null
  updateDateTime: string | null
}

const ArticleUpdateTime: React.FC<ArticleUpdateTimeProps> = ({
  updateTime,
  updateDateTime,
}) => {
  if (!updateTime || !updateDateTime) return null

  return (
    <div className={styles.updateTime}>
      <span className={styles.updateTimeTitle}>更新時間</span>
      <time dateTime={updateDateTime} className={styles.updateTimeTime}>
        {updateTime}
      </time>
    </div>
  )
}

export default ArticleUpdateTime

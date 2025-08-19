import React from 'react'
import styles from './_styles/article-update-time.module.scss'

interface ArticleUpdateTimeProps {
  updateTime: string
}

const ArticleUpdateTime: React.FC<ArticleUpdateTimeProps> = ({
  updateTime,
}) => {
  return (
    <div className={styles.updateTime}>
      <span className={styles.updateTimeTitle}>更新時間</span>
      <span className={styles.updateTimeTime}>{updateTime}</span>
    </div>
  )
}

export default ArticleUpdateTime

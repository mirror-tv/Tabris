'use client'

import { useEffect, useState } from 'react'
import styles from './_styles/article-18-warning.module.scss'

type Article18WarningProps = {
  isAdult: boolean
}

export default function Article18Warning({ isAdult }: Article18WarningProps) {
  const [shouldShowModal, setShouldShowModal] = useState(false)

  useEffect(() => {
    const isConfirmed = document.cookie
      .split('; ')
      .find((row) => row.startsWith('article-confirmedAdult='))
      ?.split('=')[1]

    const shouldShow = isAdult && isConfirmed !== 'true'
    setShouldShowModal(shouldShow)

    if (shouldShow) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isAdult])

  const handleConfirm = () => {
    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + 30)
    document.cookie = `article-confirmedAdult=true; expires=${expires.toUTCString()}; path=/`

    document.body.style.overflow = 'auto'
    setShouldShowModal(false)
  }

  const handleReject = () => {
    document.body.style.overflow = 'auto'
    window.location.replace('/')
  }

  if (!shouldShowModal) {
    return null
  }

  return (
    <div className={styles.warningModal}>
      <div className={styles.warningModal__container}>
        <div className={styles.warningModal__modal}>
          <h2>
            <span>您即將進入之內容</span>
            <span>需滿十八歲方可瀏覽</span>
          </h2>
          <p>
            根據「電腦網路內容分級處理辦法」第六條第三款規定，本網站已於各限制級網頁依照台灣網站分級推廣基金會之規定標示。若您尚未年滿十八歲，請點選離開。若您已滿十八歲，亦不可將本區之內容派發、傳閱、出售、出租、交給或借予年齡未滿18歲的人士瀏覽，或將本網站內容向該人士出示、播放或放映。
          </p>
          <div className={styles.warningModal__btns}>
            <button
              type="button"
              className={styles.btnConfirm}
              onClick={handleConfirm}
            >
              是，我已滿 18 歲
            </button>
            <button
              type="button"
              className={styles.btnReject}
              onClick={handleReject}
            >
              離開
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

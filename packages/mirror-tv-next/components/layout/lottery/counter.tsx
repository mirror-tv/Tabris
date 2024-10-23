'use client'
import React, { useEffect, useMemo, useState } from 'react'
import InfoSubmissionModal from './info-submission-modal'
import { ARTICLE_READ_THRESHOLD } from '~/constants/lottery'
import styles from './_styles/counter.module.scss'
import Cookies from 'js-cookie'
import { getNextThursdayNoon } from '~/utils/date-handler'
import { ENV } from '~/constants/environment-variables'

export default function Counter() {
  const [showModal, setShowModal] = useState(false)
  const [readStorySlugs, setReadStorySlugs] = useState<string[]>([])
  const [redeemCount, setRedeemCount] = useState<number>(0)

  useEffect(() => {
    const slugsCookieValue = Cookies.get('read-story-slugs')
    const redeemCookieValue = Cookies.get('redeem-count')

    setReadStorySlugs(slugsCookieValue ? JSON.parse(slugsCookieValue) : [])
    setRedeemCount(redeemCookieValue ? parseInt(redeemCookieValue, 10) : 0)
  }, [])

  function generateRandomStrings(count = 30, length = 5) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const randomStrings = []

    for (let i = 0; i < count; i++) {
      let result = ''
      for (let j = 0; j < length; j++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        )
      }
      randomStrings.push(result)
    }

    return randomStrings
  }

  const slugCount = readStorySlugs.length
  const canUnlock = useMemo(() => {
    return (
      slugCount - redeemCount * ARTICLE_READ_THRESHOLD >= ARTICLE_READ_THRESHOLD
    )
  }, [slugCount, redeemCount])

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
  }

  const clickSudo = () => {
    const newSudoSlugs = generateRandomStrings()
    setReadStorySlugs((prev) => {
      const newArray = [...prev, ...newSudoSlugs]
      Cookies.set('read-story-slugs', JSON.stringify(newArray), {
        expires: getNextThursdayNoon(), // 設置過期時間到當天午夜
      })
      return newArray
    })
  }

  const incrementRedeem = () => {
    setRedeemCount((prev) => {
      const newCount = prev + 1
      Cookies.set('redeem-count', newCount + '', {
        expires: getNextThursdayNoon(),
      })
      return newCount
    })
  }

  return (
    <div>
      {(ENV === 'dev' || ENV === 'local') && (
        <div className={styles.sudo} onClick={clickSudo}>
          點我新增 30 篇（只會在 dev 出現）
        </div>
      )}
      <div className={`${styles.counter} ${canUnlock ? styles.unlock : ''}`}>
        <img alt="counter" src="/images/read-story-counter.png" />
        <span className={`${styles.number} ${canUnlock ? styles.unlock : ''}`}>
          {slugCount - redeemCount * ARTICLE_READ_THRESHOLD}
        </span>
        {canUnlock && (
          <div className={styles.unlocked} onClick={handleOpenModal}>
            點擊獲得
            <br />
            抽獎資格
          </div>
        )}
      </div>
      {showModal && (
        <InfoSubmissionModal
          onClose={handleClose}
          readSlugs={readStorySlugs}
          redeemCount={redeemCount}
          incrementRedeem={incrementRedeem}
        />
      )}
    </div>
  )
}

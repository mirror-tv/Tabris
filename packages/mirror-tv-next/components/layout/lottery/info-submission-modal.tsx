import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './_styles/info-submission-modal.module.scss'
import { ARTICLE_READ_THRESHOLD } from '~/constants/lottery'
import { submitFormAction } from './action'
import { ENV } from '~/constants/environment-variables'
import axios from 'axios'

interface Props {
  readSlugs: string[]
  redeemCount: number
  incrementRedeem: () => void
  onClose: () => void
}

export default function InfoSubmissionModal({
  readSlugs,
  redeemCount,
  incrementRedeem,
  onClose,
}: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [isSubmit, setIsSubmit] = useState(false)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const getNextDate = () => {
    const dates = [
      new Date('2024-10-31T23:59:59+08:00'),
      new Date('2024-11-07T23:59:59+08:00'),
      new Date('2024-11-14T23:59:59+08:00'),
    ]
    const now = new Date()

    if (now < dates[0]) {
      return '10/31'
    } else if (now >= dates[0] && now < dates[1]) {
      return '11/07'
    } else if (now >= dates[1] && now < dates[2]) {
      return '11/14'
    } else {
      return '時間已過'
    }
  }

  const submitForm = async () => {
    if (
      readSlugs.length - redeemCount * ARTICLE_READ_THRESHOLD <
      ARTICLE_READ_THRESHOLD
    ) {
      alert('你已經填過資料囉！可以繼續看文章參加活動！')
      onClose()
      return
    }

    if (isSending) return
    setIsSending(true)

    const data = [[name, phone, address, email, new Date()]]
    try {
      let response
      if (ENV === 'prod') {
        try {
          const res = await axios.post('/api/sheets', JSON.stringify(data), {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          if (res.status !== 200) {
            throw new Error(`Error: ${res.status} - ${res.statusText}`)
          }
          response = res.data
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.log(
            JSON.stringify({ severity: 'ERROR', message: error.stack })
          )
          response = { status: error, error }
        }
      } else {
        response = await submitFormAction(data)
      }
      if (!response || response.status === 'error') {
        throw new Error(response?.error || 'Unknown error occurred')
      }
      setIsSubmit(true)
      incrementRedeem()
    } catch (error) {
      console.log(error)
      alert('看來有東西出錯囉，請再試一次。')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.closeBtn} onClick={onClose} />
        <div className={styles.counter}>
          <Image
            alt="counter"
            src="/images/read-story-counter.png"
            width={91}
            height={91}
          />
          <span className={styles.counterNumber}>
            {readSlugs.length -
              redeemCount * ARTICLE_READ_THRESHOLD +
              (isSubmit ? ARTICLE_READ_THRESHOLD : 0)}
          </span>
        </div>
        <h3
          className={styles.modalTitle}
          style={{ display: isSubmit ? 'none' : 'block' }}
        >
          恭喜獲得抽獎資格
        </h3>
        {!isSubmit ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submitForm()
            }}
          >
            <label htmlFor="name" className={styles.modalLabel}>
              姓名:
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="name"
              required
            />
            <label htmlFor="phone" className={styles.modalLabel}>
              手機號碼:
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              id="phone"
              required
              pattern="[0-9]{10}"
              title="請輸入正確的 10 位數字手機號碼"
            />
            <label htmlFor="address" className={styles.modalLabel}>
              地址:
            </label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              id="address"
              required
            />
            <label htmlFor="email" className={styles.modalLabel}>
              EMAIL:
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              required
            />
            <p className={styles.modalPs}>
              中獎會透過email進行通知，請填寫正確email
            </p>
            <button type="submit" className={styles.modalBtn}>
              送出
            </button>
          </form>
        ) : (
          <div className={`${styles.modalDone} ${styles.done}`}>
            <div className={styles.doneInfo}>
              <div className={styles.doneName}>
                {name}
                <br />
                已取得抽獎資格
              </div>
              <div className={styles.doneDate}>
                將於{getNextDate()}
                <br />
                進行開獎
              </div>
            </div>
            <button className={styles.modalBtn} onClick={onClose}>
              關閉
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

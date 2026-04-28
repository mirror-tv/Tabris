'use client'
import { useEffect, useState } from 'react'
import type { FlashNews } from '~/types/common'
import styles from './_styles/news-carousel.module.scss'

type NewsCarouselProps = {
  flashNews?: FlashNews[]
}

export default function NewsCarousel({ flashNews = [] }: NewsCarouselProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [move, setMove] = useState(-1)
  const [shouldTransition, setShouldTransition] = useState(false)

  let timeoutIdOfAuto: NodeJS.Timeout

  useEffect(() => {
    autoToNext()

    // Cleanup function to clear the timeout on component unmount
    return () => {
      clearTimeout(timeoutIdOfAuto)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, move, shouldTransition])

  const displayedArticles = () => {
    const len = flashNews.length

    if (len < 1) {
      return []
    }

    /**
     * When there are fewer than 3 articles, a problem (duplicate keys) may arise.
     * However, since it is unlikely for flash news to have fewer than 3 articles,
     * this case is currently not handled. Any future requirements will be addressed accordingly.
     */

    const curIdxPositive = (currentIdx % len) + len

    return [
      flashNews[(curIdxPositive - 1) % len],
      flashNews[curIdxPositive % len],
      flashNews[(curIdxPositive + 1) % len],
    ]
  }

  const doesHaveArticles = flashNews.length > 0

  const toNext = () => {
    if (shouldTransition) {
      return
    }

    cancelAutoToNext()
    setShouldTransition(true)
    setMove((prevMove) => prevMove - 1)
  }

  // const toPrev = () => {
  //   if (shouldTransition) {
  //     return
  //   }

  //   cancelAutoToNext()
  //   setShouldTransition(true)
  //   setMove((prevMove) => prevMove + 1)
  // }

  const handleTransitionend = () => {
    setShouldTransition(false)

    switch (move) {
      case -2:
        setMove(-1)
        setCurrentIdx((prevIdx) => prevIdx + 1)
        break
      case 0:
        setMove(-1)
        setCurrentIdx((prevIdx) => prevIdx - 1)
        break
      default:
        break
    }

    autoToNext()
  }

  const autoToNext = () => {
    timeoutIdOfAuto = setTimeout(() => {
      toNext()
    }, 3000)
  }

  const cancelAutoToNext = () => {
    clearTimeout(timeoutIdOfAuto)
  }

  return (
    <>
      {doesHaveArticles && (
        <div className={styles.container}>
          <div
            className={`${styles.titles} ${
              shouldTransition ? styles.transitioning : ''
            } flash-news flash-news-wrapper`}
            style={{ transform: `translateY(${move * 100}%)` }}
            onTransitionEnd={handleTransitionend}
          >
            {displayedArticles().map((article) => (
              <a
                key={`flash-${article.slug}`}
                className={[styles.news, 'truncate-text-one-line'].join(' ')}
                href={`/story/${article.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {article.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

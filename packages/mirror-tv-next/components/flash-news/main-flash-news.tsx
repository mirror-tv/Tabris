import errors from '@twreporter/errors'
import {
  FLASH_NEWS_JSON_URL,
  GLOBAL_CACHE_SETTING,
} from '~/constants/environment-variables'
import styles from './_styles/main-flash-news.module.scss'
import type { FlashNews } from '~/types/common'
import UiMobFlashNews from './ui-mob-flash-news'
import UiPcFlashNews from './ui-pc-flash-news'

async function getData() {
  try {
    const res = await fetch(FLASH_NEWS_JSON_URL, {
      next: { revalidate: GLOBAL_CACHE_SETTING },
    })

    if (!res.ok) {
      console.error('Failed to fetch flash news data')
      return { allPosts: [] }
    }

    return res.json()
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching flash news'
    )

    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(annotatingError, {
          withStack: false,
          withPayload: true,
        }),
      })
    )
    return
  }
}

export default async function MainFlashNews() {
  let flashNews: FlashNews[] = []

  const { allPosts } = await getData()
  flashNews = allPosts

  return (
    <>
      <div className={styles.pcWrapper}>
        <UiPcFlashNews flashNews={flashNews} />
      </div>
      <div className={styles.mobWrapper}>
        <UiMobFlashNews flashNews={flashNews} />
      </div>
    </>
  )
}

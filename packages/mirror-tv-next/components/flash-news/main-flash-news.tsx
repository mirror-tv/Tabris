import errors from '@twreporter/errors'
import { fetchStaticJson } from '~/utils/fetch-static-json'
import styles from './_styles/main-flash-news.module.scss'
import type { FlashNews } from '~/types/common'
import UiMobFlashNews from './ui-mob-flash-news'
import UiPcFlashNews from './ui-pc-flash-news'

async function getData() {
  try {
    return await fetchStaticJson<{ allPosts: FlashNews[] }>('flash_news.json')
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
    return { allPosts: [] }
  }
}

export default async function MainFlashNews() {
  let flashNews: FlashNews[] = []

  const { allPosts } = (await getData()) ?? { allPosts: [] }
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

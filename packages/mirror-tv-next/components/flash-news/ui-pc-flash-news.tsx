import type { FlashNews } from '~/types/common'
import styles from './_styles/ui-pc-flash-news.module.scss'
import NewsCarousel from './news-carousel'

type UiPcFlashNewsProps = {
  flashNews: FlashNews[]
}

export default function UiPcFlashNews({ flashNews }: UiPcFlashNewsProps) {
  return (
    <div className={styles.flashNews}>
      <p className={styles.tag}>快訊</p>

      <NewsCarousel flashNews={flashNews} />
    </div>
  )
}

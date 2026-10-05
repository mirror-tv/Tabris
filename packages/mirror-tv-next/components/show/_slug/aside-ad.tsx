'use client'
import styles from './_styles/aside-ad.module.scss'
import useWindowDimensions from '~/hooks/use-window-dimensions'
import GPTAd from '~/components/ads/gpt/gpt-ad'

export default function AsideAd() {
  const { width: viewportWidth = 0 } = useWindowDimensions()

  if (viewportWidth === 0 || viewportWidth < 768) {
    return null
  }

  return (
    <aside className={styles.aside}>
      <GPTAd adUnit="mnews_program_sidebar_300x250_01" />
      <GPTAd adUnit="mnews_program_sidebar_300x250_02" />
      <GPTAd adUnit="mnews_program_sidebar_300x600_03" />
    </aside>
  )
}

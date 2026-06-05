'use client'
import dynamic from 'next/dynamic'

import useWindowDimensions from '~/hooks/use-window-dimensions'
import UiHeadingBordered from '../shared/ui-heading-bordered'
import styles from './_styles/ad-popin-recommend.module.scss'

const LazyRenderWrapper = dynamic(
  () => import('~/components/shared/lazy-render-wrapper'),
  {
    ssr: false,
  }
)

const AdPopinRecommend: React.FC = () => {
  const { width } = useWindowDimensions()

  if (!width || width < 1200) {
    return null
  }

  return (
    <>
      <UiHeadingBordered title="每日精選" className={styles.dailySelection} />
      <div className={styles.popinRecommend}>
        <LazyRenderWrapper>
          <div id="_popIn_recommend" className="popin_recommend" />
        </LazyRenderWrapper>
      </div>
    </>
  )
}

export default AdPopinRecommend

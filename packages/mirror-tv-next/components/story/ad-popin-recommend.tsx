'use client'

import useWindowDimensions from '~/hooks/use-window-dimensions'
import UiHeadingBordered from '../shared/ui-heading-bordered'
import styles from './_styles/ad-popin-recommend.module.scss'

const AdPopinRecommend: React.FC = () => {
  const { width } = useWindowDimensions()

  if (!width || width < 1200) {
    return null
  }

  return (
    <>
      <UiHeadingBordered title="每日精選" className={styles.dailySelection} />
      <div className={styles.popinRecommend}>
        <div id="_popIn_recommend" className="popin_recommend" />
      </div>
    </>
  )
}

export default AdPopinRecommend

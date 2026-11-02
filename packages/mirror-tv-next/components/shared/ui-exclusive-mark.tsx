import styles from './_styles/ui-exclusive-mark.module.scss'
import ResponsiveImage from '~/components/shared/responsive-image'

export type UiExclusiveMarkProps = {
  className?: string
  /**
   * The mark is 30% of the card height at 3:2, so its width follows the card.
   * Defaults to regular post cards (about 60-70px on desktop).
   */
  sizes?: string
}

export default function UiExclusiveMark({
  className = '',
  sizes = '(max-width: 767px) 30vw, 72px',
}: UiExclusiveMarkProps) {
  return (
    <div className={`${styles.exclusiveMark} ${className}`}>
      <ResponsiveImage
        images="/icons/exclusive-logo.png"
        alt="獨家 SCOOP"
        sizes={sizes}
        placeholder={null}
        style={{ objectFit: 'contain' }}
      />
    </div>
  )
}

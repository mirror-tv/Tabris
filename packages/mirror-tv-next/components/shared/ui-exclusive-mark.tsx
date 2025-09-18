import styles from './_styles/ui-exclusive-mark.module.scss'
import Image from 'next/image'

export type UiExclusiveMarkProps = {
  className?: string
}

export default function UiExclusiveMark({
  className = '',
}: UiExclusiveMarkProps) {
  return (
    <div className={`${styles.exclusiveMark} ${className}`}>
      <Image
        src="/icons/exclusive-logo.png"
        alt="獨家 SCOOP"
        fill
        className={styles.image}
        priority={false}
      />
    </div>
  )
}

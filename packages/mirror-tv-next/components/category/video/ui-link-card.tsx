import styles from './_styles/ui-link-card.module.scss'

import Image from '~/components/shared/image'

type UiLinkCardProps = {
  link: LinkInfo
}

export type LinkInfo = {
  href: string
  leftIcon: { src: string; width: number; height: number }
  rightIcon?: string
  leftText: string
  rightText: string
  themeColor: string
  idForGaTarget: string
}

export default function UiLinkCard({ link }: UiLinkCardProps) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      key={link.href}
      className={styles.link}
    >
      <div id={link.idForGaTarget} className={styles.mask} />
      <div
        className={`${styles.left} ${
          link.idForGaTarget === 'line-follow' ? 'line' : ''
        }`}
      >
        <Image
          src={link.leftIcon.src}
          alt={link.leftText}
          width={link.leftIcon.width}
          height={link.leftIcon.height}
        />
        <span>{link.leftText}</span>
      </div>
      <div className={styles.right} style={{ background: link.themeColor }}>
        {!!link.rightIcon && (
          <Image
            src={link.rightIcon}
            alt={link.rightText}
            className={styles.rightIcon}
            width={18}
            height={120}
          />
        )}
        <span>{link.rightText}</span>
      </div>
    </a>
  )
}

import styles from './_styles/ui-post-card-homepage.module.scss'
import { formateDateAtTaipei, PostImage } from '~/utils'
import ResponsiveImage from '../shared/responsive-image'
import UiExclusiveMark from '../shared/ui-exclusive-mark'
import { SALES_LABEL_NAME } from '~/constants/constant'

export type UiPostCardProps = {
  title: string
  date: Date
  href: string
  postStyle: string | undefined
  images: PostImage
  imagesWebP?: PostImage
  postTitleHighlightText?: string
  label?: string
  exclusive?: boolean
}

export default function UiPostCardHomepage({
  title = '',
  date,
  href = '',
  images,
  imagesWebP,
  postStyle = 'article',
  label,
  exclusive = false,
}: UiPostCardProps) {
  const isVideoNews = postStyle === 'videoNews'

  return (
    <a
      className={[styles.card, 'article-card'].join(' ')}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
    >
      <span className={styles.cardWrapper}>
        <figure className={styles.cardImage}>
          {label === SALES_LABEL_NAME && (
            <span className={`${styles.label} ${styles.yellowBlack}`}>
              {label}
            </span>
          )}
          {exclusive && label !== SALES_LABEL_NAME && <UiExclusiveMark />}
          <ResponsiveImage
            images={images}
            imagesWebP={imagesWebP}
            alt={title}
            rwd={{ mobile: '500px', tablet: '500px', desktop: '500px' }}
            priority={false}
          />
          {isVideoNews && <span className={styles.videoIcon}></span>}
        </figure>
        <div className={styles.info}>
          <span className={styles.infoDate}>
            {formateDateAtTaipei(date, 'YYYY.MM.DD HH:mm', '')}
          </span>
          <span
            className={styles.infoTitle}
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>
      </span>
    </a>
  )
}

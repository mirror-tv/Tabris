import styles from './_styles/ui-post-card-homepage.module.scss'
import { formateDateAtTaipei, PostImage } from '~/utils'
import UiExclusiveMark from '../shared/ui-exclusive-mark'
import { SALES_LABEL_NAME } from '~/constants/constant'
import NextResponsiveImage from '../shared/next-responsive-image'

export type UiPostCardProps = {
  title: string
  date: Date
  href: string
  postStyle: string | undefined
  images: PostImage
  postTitleHighlightText?: string
  label?: string
  exclusive?: boolean
}

export default function UiPostCardHomepage({
  title = '',
  date,
  href = '',
  images,
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
          <NextResponsiveImage
            fill
            loading="lazy"
            placeholder="blur"
            blurDataURL="/images/loading.svg"
            src={
              images.original?.replace(/\.jpg$/i, '.webP') ??
              '/images/image-default.jpg'
            }
            sizes="(max-width: 768px) 50vw, 30vw"
            srcSet={[480, 800]}
            alt={title}
            priority={false}
            fallback={images.original}
            style={{ aspectRatio: '3 / 2' }}
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

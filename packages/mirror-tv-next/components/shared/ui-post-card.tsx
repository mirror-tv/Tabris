import styles from './_styles/ui-post-card.module.scss'
import { formateDateAtTaipei, PostImage } from '~/utils'
import ResponsiveImage from './responsive-image'

export type UiPostCardProps = {
  title: string
  date: Date
  href: string
  postStyle: string | undefined
  images: PostImage

  // Differentiate two usages in / and /category/:name pages
  mobileLayoutDirection: 'row' | 'column'
  postTitleHighlightText?: string
}

export default function UiPostCard({
  title = '',
  date,
  href = '',
  images,
  postStyle = 'article',
  mobileLayoutDirection = 'column',
  postTitleHighlightText,
}: UiPostCardProps) {
  const isVideoNews = postStyle === 'videoNews'

  // keyword 時有些字體會被 height light
  const highlightTextProducer = (title: string): string | TrustedHTML => {
    const highlightTextProducer = (text: string) => {
      return `<span style="color: #014db8">${text}</span>`
    }
    const re = new RegExp(title.split(' ').join('|'), 'gi')
    return title.replace(re, function (matchedText) {
      return highlightTextProducer(matchedText)
    })
  }
  const postTitleProcessed = postTitleHighlightText
    ? highlightTextProducer(title)
    : title

  return (
    <a
      className={[
        styles.card,
        mobileLayoutDirection === 'row' ? styles.row : '',
        'article-card',
      ].join(' ')}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
    >
      <span className={styles.cardWrapper}>
        <figure className={styles.cardImage}>
          <ResponsiveImage
            images={images}
            alt={title}
            rwd={{ mobile: '500px', tablet: '500px', desktop: '500px' }}
            priority={false}
          />
          {isVideoNews && <span className={styles.videoIcon}></span>}
        </figure>
        <div className={styles.info}>
          <span
            className={styles.infoTitle}
            dangerouslySetInnerHTML={{ __html: postTitleProcessed }}
          />
          <span className={styles.infoDate}>
            {formateDateAtTaipei(date, 'YYYY.MM.DD HH:mm', '')}
          </span>
        </div>
      </span>
    </a>
  )
}

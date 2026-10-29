import styles from './_styles/ui-post-card-aside.module.scss'
import { formateDateAtTaipei } from '~/utils'
import UiExclusiveMark from './ui-exclusive-mark'
import ResponsiveImage from '~/components/shared/responsive-image'

type UiPostCardAsideProps = {
  title: string
  date: Date
  href: string
  postStyle: string
  page: 'category' | 'story'
  images: string
  exclusive: boolean
}

export default function UiPostCardAside({
  title = '',
  date,
  href = '',
  images,
  postStyle = 'post',
  page = 'category',
  exclusive = false,
}: UiPostCardAsideProps) {
  const isVideoNews = postStyle === 'videoNews'
  const isCategoryPage = (type: string) => type === 'category'
  const figureClassNameByProps = isCategoryPage(page)
    ? 'categoryImage'
    : 'storyImage'

  return (
    <a
      className={[styles.card].join(' ')}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
    >
      <div className={[styles.image, styles[figureClassNameByProps]].join(' ')}>
        <ResponsiveImage
          images={images}
          fill
          className={[styles.image, styles[figureClassNameByProps]].join(' ')}
          sizes="(max-width: 767px) 130px, (max-width: 1199px) 120px, 150px"
          alt={title}
          style={{ aspectRatio: '3 / 2' }}
        />
        {isVideoNews && <span className={styles.videoIcon}></span>}
        {exclusive && <UiExclusiveMark />}
      </div>
      <div className={styles.info}>
        <span className={styles.title}>{title}</span>
        {page === 'story' && (
          <span className={styles.date}>
            {formateDateAtTaipei(date, 'YYYY.MM.DD HH:mm', '')}
          </span>
        )}
      </div>
    </a>
  )
}

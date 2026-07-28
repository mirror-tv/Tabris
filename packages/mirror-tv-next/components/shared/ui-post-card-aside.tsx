import styles from './_styles/ui-post-card-aside.module.scss'
import { formateDateAtTaipei } from '~/utils'
import UiExclusiveMark from './ui-exclusive-mark'
import NextResponsiveImage from './next-responsive-image'

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
        <NextResponsiveImage
          fill
          className={[styles.image, styles[figureClassNameByProps]].join(' ')}
          loading="lazy"
          placeholder="blur"
          blurDataURL="/images/loading.svg"
          src={images}
          sizes="(max-width: 768px) 50vw, 30vw"
          srcSet={[480, 800]}
          alt={title}
          priority={false}
          fallback={images}
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

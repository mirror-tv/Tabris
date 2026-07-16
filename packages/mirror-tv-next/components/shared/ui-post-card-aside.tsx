import styles from './_styles/ui-post-card-aside.module.scss'
import { formateDateAtTaipei, PostImage } from '~/utils'
import UiExclusiveMark from './ui-exclusive-mark'
import NextResponsiveImage from './next-responsive-image'

type UiPostCardAsideProps = {
  title: string
  date: Date
  href: string
  postStyle: string
  page: 'category' | 'story'
  images: PostImage
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
      <figure
        className={[styles.image, styles[figureClassNameByProps]].join(' ')}
      >
        <NextResponsiveImage
          fill
          loading="lazy"
          placeholder="blur"
          blurDataURL="/images/loading.svg"
          src={images.original.replace(/\.jpg$/i, '.webP')}
          sizes="(max-width: 768px) 50vw, 30vw"
          srcSet={[480, 800]}
          alt={title}
          priority={false}
          fallback={images.original}
          style={{ aspectRatio: '3 / 2' }}
        />
        {isVideoNews && <span className={styles.videoIcon}></span>}
        {exclusive && <UiExclusiveMark />}
      </figure>
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

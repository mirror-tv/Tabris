import styles from './_styles/ui-post-card-aside.module.scss'
import { formateDateAtTaipei, PostImage } from '~/utils'
import ResponsiveImage from './responsive-image'
import UiExclusiveMark from './ui-exclusive-mark'

type UiPostCardAsideProps = {
  title: string
  date: Date
  href: string
  postStyle: string
  page: 'category' | 'story'
  images: PostImage
  imagesWebP?: PostImage
  exclusive: boolean
}

export default function UiPostCardAside({
  title = '',
  date,
  href = '',
  images,
  imagesWebP,
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
        <ResponsiveImage
          images={images}
          imagesWebP={imagesWebP}
          alt={title}
          rwd={{ mobile: '500px', tablet: '500px', desktop: '500px' }}
          priority={false}
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

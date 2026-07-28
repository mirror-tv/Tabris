import styles from './_styles/ui-post-card-homepage.module.scss'
import { formateDateAtTaipei } from '~/utils'
import UiExclusiveMark from '../shared/ui-exclusive-mark'
import { SALES_LABEL_NAME } from '~/constants/constant'
import NextResponsiveImage from '../shared/next-responsive-image'
import { PostWithCategory } from '~/graphql/query/posts'
import type { HeroImage } from '~/graphql/fragments/listing-post'

export type UiPostCardProps = PostWithCategory<string | null | HeroImage>

export default function UiPostCardHomepage(props: UiPostCardProps) {
  const href =
    props.__typename === 'External' || props.partner?.slug === 'external'
      ? `/external/${props.slug}`
      : `/story/${props.slug}`
  const label = props.categories?.[0]?.name || ''
  const exclusive = props.exclusive ?? false
  const isVideoNews = props.style === 'videoNews'

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
              typeof props.heroImage === 'string'
                ? props.heroImage.replace(/\.(jpg|png)$/i, '.webP')
                : '/images/image-default.jpg'
            }
            sizes="(max-width: 768px) 50vw, 30vw"
            srcSet={[480, 800]}
            alt={props.name}
            priority={false}
            fallback={
              typeof props.heroImage === 'string'
                ? props.heroImage
                : props.heroImage?.resized?.original
            }
            style={{ aspectRatio: '3 / 2' }}
          />
          {isVideoNews && <span className={styles.videoIcon}></span>}
        </figure>
        <div className={styles.info}>
          <span className={styles.infoDate}>
            {formateDateAtTaipei(
              new Date(props.publishTime),
              'YYYY.MM.DD HH:mm',
              ''
            )}
          </span>
          <span
            className={styles.infoTitle}
            dangerouslySetInnerHTML={{ __html: props.name }}
          />
        </div>
      </span>
    </a>
  )
}

'use client'
import { type SinglePost } from '~/graphql/query/story'
import styles from './_styles/article-hero-image-and-video.module.scss'
import Image from '@readr-media/react-image'
import { formateHeroImage } from '~/utils/image-handler'
import { extractYoutubeId } from '~/utils'

type ArticleHeroImageAndVideoProps = {
  heroImage: SinglePost['heroImage']
  title: string
  heroCaption?: SinglePost['heroCaption']
  style?: SinglePost['style']
  heroVideo?: SinglePost['heroVideo']
}

const ArticleHeroImageAndVideo: React.FC<ArticleHeroImageAndVideoProps> = (
  props
) => {
  const { heroImage, title, heroCaption, style, heroVideo } = props
  const { images, imagesWebP } = formateHeroImage(heroImage ?? undefined)

  return (
    <figure className={styles.heroCaptionWrapper}>
      {style === 'videoNews' ? (
        heroVideo?.youtubeUrl && (
          <div className={styles.heroVideoWrapper}>
            <iframe
              src={`https://www.youtube.com/embed/${extractYoutubeId(
                heroVideo.youtubeUrl
              )}`}
              title="title"
            ></iframe>
          </div>
        )
      ) : (
        <div className={styles.heroImageWrapper}>
          <Image
            images={images}
            imagesWebP={imagesWebP}
            alt={title}
            defaultImage="/images/image-default.jpg"
            rwd={{
              mobile: '100vw',
              tablet: '100vw',
              laptop: '1200px',
              desktop: '1200px',
              default: '100vw',
            }}
            priority
          />
        </div>
      )}

      {heroCaption && <figcaption>{heroCaption}</figcaption>}
    </figure>
  )
}

export default ArticleHeroImageAndVideo

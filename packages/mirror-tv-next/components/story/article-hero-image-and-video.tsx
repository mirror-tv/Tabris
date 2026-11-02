'use client'
import { type SinglePost } from '~/graphql/query/story'
import styles from './_styles/article-hero-image-and-video.module.scss'
import ResponsiveImage from '~/components/shared/responsive-image'
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
          <ResponsiveImage
            images={images}
            imagesWebP={imagesWebP}
            alt={title}
            priority
            sizes="(max-width: 767px) 100vw, 600px"
          />
        </div>
      )}

      {heroCaption && <figcaption>{heroCaption}</figcaption>}
    </figure>
  )
}

export default ArticleHeroImageAndVideo

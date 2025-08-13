'use client'
import { type SinglePost } from '~/graphql/query/story'
import styles from './_styles/article-hero-image.module.scss'
import Image from '@readr-media/react-image'
import { formateHeroImage } from '~/utils/image-handler'

type ArticleHeroImageProps = {
  heroImage: SinglePost['heroImage']
  title: string
  heroCaption?: SinglePost['heroCaption']
}

const ArticleHeroImage: React.FC<ArticleHeroImageProps> = (props) => {
  const { heroImage, title, heroCaption } = props
  const formattedHeroImage = formateHeroImage(heroImage)

  return (
    <figure className={styles.heroCaptionWrapper}>
      <div className={styles.heroImageWrapper}>
        <Image
          images={formattedHeroImage}
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
      {heroCaption && <figcaption>{heroCaption}</figcaption>}
    </figure>
  )
}

export default ArticleHeroImage

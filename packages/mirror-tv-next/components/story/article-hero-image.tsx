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
    <div className={styles.heroImageWrapper}>
      <figure>
        <Image
          images={formattedHeroImage}
          alt={title}
          defaultImage="/images/image-default.jpg"
          rwd={{
            mobile: '100vw',
            tablet: '100vw',
            laptop: '100vw',
            desktop: '100vw',
            default: '100vw',
          }}
          priority
        />
        {heroCaption && <figcaption>{heroCaption}</figcaption>}
      </figure>
    </div>
  )
}

export default ArticleHeroImage

import Image from 'next/image'
import styles from './_styles/article-social-list.module.scss'
import { socialMediaConfig, socialMediaOrder } from '~/constants/social-medial'

const ArticleSocialList = () => {
  return (
    <div className={styles.followUsWrapper}>
      <p className={styles.followUs}>追蹤我們</p>
      <br className={styles.desktopOnly} />
      <ul className={styles.socialMediaList}>
        {socialMediaOrder.map((socialMedia) => {
          const socialMediaData = socialMediaConfig[socialMedia]
          const imageSize = 50
          const defaultImageSrc = '/images/image-default.jpg'

          const { image, href } = socialMediaData
          const imageConfig = {
            alt: socialMedia,
            src: image || defaultImageSrc,
            width: imageSize,
            height: imageSize,
          } satisfies Parameters<typeof Image>[0]

          return (
            <li key={socialMedia}>
              <a href={href}>
                <Image {...imageConfig} />
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
export default ArticleSocialList

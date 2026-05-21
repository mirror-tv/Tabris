import Image from 'next/image'
import styles from './_styles/article-social-list.module.scss'
import { socialMediaConfig, socialMediaOrder } from '~/constants/social-medial'
import { withBasePath } from '~/constants/with-base-path'

const ArticleSocialList = () => {
  return (
    <div
      className={`${styles.followUsWrapper} social-list__list post__social-media-share`}
    >
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
            src: withBasePath(image || defaultImageSrc),
            width: imageSize,
            height: imageSize,
          } satisfies Parameters<typeof Image>[0]

          return (
            <li key={socialMedia}>
              <a href={href} className={socialMedia}>
                <Image {...imageConfig} className={socialMedia} />
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
export default ArticleSocialList

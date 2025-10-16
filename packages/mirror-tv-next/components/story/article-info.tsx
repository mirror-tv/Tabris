import { type SinglePost } from '~/graphql/query/story'
import styles from './_styles/article-info.module.scss'
import { CONTACT_MAPPING } from '~/constants/constant'
import ShareButton from './share-button'

type ArticleHeroImageProps = {
  title: string
  publishTime: string
  category: SinglePost['categories'][0]
  writers: SinglePost['writers']
  photographers: SinglePost['photographers']
  cameraOperators: SinglePost['cameraOperators']
  designers: SinglePost['designers']
  engineers: SinglePost['engineers']
  vocals: SinglePost['vocals']
  otherbyline: string
}

export default function ArticleInfo({
  title,
  publishTime,
  category,
  writers,
  photographers,
  cameraOperators,
  designers,
  engineers,
  vocals,
  otherbyline,
}: ArticleHeroImageProps) {
  const creditList = Object.entries(CONTACT_MAPPING)
    .map(([key, title]) => ({
      title,
      list:
        {
          writers,
          photographers,
          cameraOperators,
          designers,
          engineers,
          vocals,
        }[key as keyof typeof CONTACT_MAPPING] || [],
    }))
    .filter(({ list }) => list.length > 0)

  return (
    <>
      <section className={styles.categoryAndPublishTime}>
        <span className={styles.category}>{category?.title}</span>
        {publishTime && (
          <span className="amp-pub-cat-publishTime">{publishTime}</span>
        )}
      </section>
      <h1 className={styles.title}>{title}</h1>
      <ul className={styles.credit}>
        {!!creditList.length &&
          creditList.map((item) => {
            return (
              <li key={item.title} className={styles.creditItem}>
                {item.title}｜
                {item.list?.map(
                  (person, key) => `${key ? '、' : ''}${person.name}`
                )}
              </li>
            )
          })}
        <li key="other" className={styles.creditItem}>
          {otherbyline}
        </li>
      </ul>
      <div className={`${styles.share} post__social-media-share`}>
        <ShareButton type="facebook" />
        <ShareButton type="line" />
        <ShareButton type="twitter" />
        <ShareButton type="copy" />
      </div>
    </>
  )
}

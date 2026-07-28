import type { PostCardItem } from '~/graphql/query/posts'
import type { RawPopularPost } from '~/types/popular-post'
import styles from './_styles/ui-list-posts-aside.module.scss'
import UiHeadingBordered from './ui-heading-bordered'
import UiPostCardAside from './ui-post-card-aside'
import { HeroImage } from '~/graphql/fragments/listing-post'

type UiListPostsAsideProps = {
  listTitle: string
  listData: RawPopularPost[] | PostCardItem[]
  page: 'category' | 'story' // 目前這兩個頁面會用共基本部分，但有些細微樣式不同
  className: string // for gtm
}

function getImagePath(heroImage: string | HeroImage | null) {
  if (!heroImage) {
    return null
  }

  if (typeof heroImage === 'string') {
    return heroImage
  }

  if ('imageApiData' in heroImage) {
    return heroImage.imageApiData?.url
  }

  return null
}

export default function UiListPostsAside({
  listTitle,
  listData,
  page,
  className,
}: UiListPostsAsideProps) {
  return (
    <div
      className={[
        styles.wrapper,
        page === 'story' ? styles.articleWrapper : '',
        page === 'category' ? styles.bordered : '',
        className,
      ].join(' ')}
    >
      <UiHeadingBordered title={listTitle} className={styles.listTitle} />
      <div
        className={`${styles.list} ${
          page === 'category' ? styles.listBordered : ''
        } ${
          listTitle === '熱門新聞'
            ? 'aside__list-popular'
            : 'aside__list-latest'
        } list-wrapper`}
      >
        {listData?.map((item) => {
          return (
            <div
              key={`list-article-aside-${item.slug}`}
              className={['list__list-item', styles.item].join(' ')}
            >
              <li style={{ listStyle: 'none' }}>
                <UiPostCardAside
                  href={`/story/${item.slug}`}
                  images={
                    getImagePath(item.heroImage)?.replace(/\.jpg$/i, '.webP') ??
                    '/images/image-default.jpg'
                  }
                  title={item.name}
                  page={page}
                  postStyle="article"
                  date={new Date(item.publishTime)}
                  exclusive={item?.exclusive ?? false}
                />
              </li>
            </div>
          )
        })}
      </div>
    </div>
  )
}

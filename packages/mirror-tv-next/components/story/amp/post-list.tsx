import { FormattedPostCardJson } from '~/utils'
import { getHeroImageOfAmp } from '~/utils/image-handler'

type PostListProps = {
  title: string
  list: FormattedPostCardJson[]
  className?: string
}

export default function PostList({ title, list, className }: PostListProps) {
  return (
    <section className={`amp-post-list-wrapper ${className || ''}`}>
      <h3 className="amp-post-list-title">{title}</h3>
      <ul className="amp-card-list">
        {list?.map((item) => {
          const heroSrc =
            getHeroImageOfAmp(item.images) || '/images/image-default.jpg'
          return (
            <li
              key={`list-article-${item.slug}`}
              className="amp-post-list-item amp-card-list-item"
            >
              <a
                href={item.href.replace('/story/', '/story/amp/')}
                target="_blank"
                rel="noreferrer noopener"
                className="amp-post-list-link"
              >
                <div className="amp-post-list-image-wrapper">
                  <amp-img
                    alt={item.name}
                    src={heroSrc}
                    width="130"
                    height="130"
                    layout="fixed"
                    className="amp-card-list-item-image-image"
                  />
                </div>
                <span className="amp-post-list-title-text">{item.name}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

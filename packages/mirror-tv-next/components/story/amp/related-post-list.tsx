import { SingleRelatedPost } from '~/graphql/query/story'

type PostListProps = {
  title: string
  list: SingleRelatedPost[]
  className: string
}

export default function RelatedPostList({
  title,
  list,
  className,
}: PostListProps) {
  return (
    <div className={`amp-related-list-wrapper ${className}`}>
      <h3 className="amp-related-list-title">{title}</h3>
      <ul className="amp-card-list">
        {list?.map((item) => {
          return (
            <li
              key={`list-article-${item.slug}`}
              className="amp-related-list-item amp-card-list-item"
            >
              <a
                href={`/story/amp/${item.slug}`}
                target="_blank"
                rel="noreferrer noopener"
                className="amp-related-list-link"
              >
                <span className="amp-related-list-title-text amp_ga-article-related">
                  {item.name}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

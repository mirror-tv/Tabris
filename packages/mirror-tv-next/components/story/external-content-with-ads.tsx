import ArticleInlineAds from '~/components/story/article-inline-ads'
import { splitHtmlWithArticleAds } from '~/utils/insert-article-ads'

export default function ExternalContentWithAds({
  html,
  className,
}: {
  html: string
  className?: string
}) {
  const parts = splitHtmlWithArticleAds(html)

  return (
    <div className={className}>
      {parts.map((part, index) =>
        part.type === 'html' ? (
          <div
            key={`html-${index}`}
            style={{ display: 'contents' }}
            dangerouslySetInnerHTML={{ __html: part.html }}
          />
        ) : (
          <ArticleInlineAds key={`ad-${part.pair}-${index}`} pair={part.pair} />
        )
      )}
    </div>
  )
}

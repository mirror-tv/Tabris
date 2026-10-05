import GPTAd from '~/components/ads/gpt/gpt-ad'
import { ARTICLE_INLINE_AD, type ArticleAdPair } from '~/utils/insert-article-ads'

const AD_UNITS: Record<ArticleAdPair, [string, string]> = {
  [ARTICLE_INLINE_AD.gila]: [
    'mnews_article_middle_1',
    'mnews_m_article_middle_1',
  ],
  [ARTICLE_INLINE_AD.mid]: [
    'mnews_article_middle_300x250_01',
    'mnews_m_article_middle_300x250',
  ],
}

export default function ArticleInlineAds({ pair }: { pair: ArticleAdPair }) {
  return (
    <>
      {AD_UNITS[pair].map((adUnit) => (
        <GPTAd key={adUnit} adUnit={adUnit} />
      ))}
    </>
  )
}

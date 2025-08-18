import ArticleRelatedPosts from '~/components/story/article-related-posts'
import ArticleSocialList from '~/components/story/article-social-list'

import styles from './_styles/story.module.scss'
import { fetchStoryBySlug } from '~/utils/fetch-function'
import ArticleHeroImageAndVideo from '~/components/story/article-hero-image-and-video'
import ApiDataRenderer from '~/components/story/api-data-renderer/renderer'
import { formateDateAtTaipei } from '~/utils'
import ArticleInfo from '~/components/story/article-info'
import { notFound } from 'next/navigation'
import ArticleBrief from '~/components/story/article-brief'
import { doesHaveBrief } from '~/utils'

type StoryPageTypes = {
  params: { slug: string }
}
const StoryPage = async (props: StoryPageTypes) => {
  const { params } = props
  const fetchStoryBySlugResponse = await fetchStoryBySlug(params.slug)
  const [storyData] = fetchStoryBySlugResponse.allPosts
  if (!storyData) {
    notFound()
  }

  const {
    contentApiData,
    relatedPosts,
    heroImage,
    heroCaption,
    categories,
    title,
    publishTime,
    writers,
    photographers,
    cameraOperators,
    designers,
    engineers,
    vocals,
    otherbyline,
    briefApiData,
    style,
    heroVideo,
  } = storyData
  const publishTimeTaipei = formateDateAtTaipei(
    new Date(publishTime),
    'YYYY.MM.DD HH:mm',
    '臺北時間'
  )

  const hasBrief = doesHaveBrief(briefApiData)

  return (
    <section className={styles.article}>
      <ArticleHeroImageAndVideo
        heroImage={heroImage}
        title={heroCaption}
        heroCaption={heroCaption}
        style={style}
        heroVideo={heroVideo}
      />
      <ArticleInfo
        title={title}
        publishTime={publishTimeTaipei}
        category={categories?.[0]}
        writers={writers}
        photographers={photographers}
        cameraOperators={cameraOperators}
        designers={designers}
        engineers={engineers}
        vocals={vocals}
        otherbyline={otherbyline}
      />
      {hasBrief && <ArticleBrief brief={JSON.parse(briefApiData || '[]')} />}
      <section className={styles.contentWrapper}>
        <ApiDataRenderer contentData={contentApiData} isStoryBrief={false} />
      </section>
      <section className={styles.socialAndRelatedWrapper}>
        <ArticleSocialList />
        <ArticleRelatedPosts relatedPosts={relatedPosts} />
      </section>
    </section>
  )
}

export default StoryPage

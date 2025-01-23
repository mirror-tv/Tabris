import ArticleRelatedPosts from '~/components/story/article-related-posts'
import ArticleSocialList from '~/components/story/article-social-list'

import styles from './_styles/story.module.scss'
import { fetchStoryBySlug } from '~/app/_actions/story/fetch-story-post-by-slug'
import ArticleHeroImage from '~/components/story/article-hero-image'

type StoryPageTypes = {
  params: { slug: string }
}
const StoryPage = async (props: StoryPageTypes) => {
  const { params } = props
  const fetchStoryBySlugResponse = await fetchStoryBySlug(params.slug)
  const [storyData] = fetchStoryBySlugResponse
  const { relatedPosts, heroImage, heroCaption } = storyData

  return (
    <div>
      StoryPage slug is : {params.slug}
      <section className={styles.socialAndRelatedWrapper}>
        <ArticleHeroImage
          heroImage={heroImage}
          title={heroCaption}
          heroCaption={heroCaption}
        />
        <ArticleSocialList />
        <ArticleRelatedPosts relatedPosts={relatedPosts} />
      </section>
    </div>
  )
}

export default StoryPage

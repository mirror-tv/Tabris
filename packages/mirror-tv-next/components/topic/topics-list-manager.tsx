'use client'
import { Topic } from '~/graphql/query/topic'
import { fetchTopics } from '~/components/topic/action'
import styles from '~/styles/components/topic/topics-list-manager.module.scss'
import UiTopicCard from '~/components/topic/ui-topic-card'
import { formatePostImage } from '~/utils'
import type { PostImage } from '~/utils'
import type { ApiData } from '~/types/api-data'
import InfiniteScrollList from '~/components/shared/infinite-scroll-list'

type TopicsListManagerProps = {
  pageSize: number
  topicsCount: number
  initTopicsList: Topic[]
}

type FormatArticleCard = {
  id: string
  title: string
  href: string
  brief: ApiData[]
  images: PostImage
}

export default function TopicsListManager({
  pageSize,
  topicsCount,
  initTopicsList,
}: TopicsListManagerProps) {
  function handleApiData(apiData: string): ApiData[] {
    try {
      const rawString = apiData ?? ''
      const content = JSON.parse(rawString)

      return content?.filter((item: ApiData) => item) || []
    } catch {
      return []
    }
  }

  function doesHaveBrief(data: ApiData[] = []) {
    const validateArray = data.map((item) => {
      return item?.content?.length > 1 || item?.content[0]?.length > 0
    })
    return validateArray.find((item) => {
      return item
    })
  }

  function transformBrief(briefApiData = ''): ApiData[] {
    const data: ApiData[] = briefApiData ? handleApiData(briefApiData) : []
    return data.length && doesHaveBrief(data) ? data : []
  }

  const formatArticleCard = (topic: Topic): FormatArticleCard => {
    const { id = '', slug = '', name = '', briefApiData } = topic || {}
    return {
      id,
      title: name,
      href: `/topic/${slug}`,
      brief: transformBrief(briefApiData),
      images: formatePostImage(topic),
    }
  }

  const formattedTopicsList = (list: Topic[]) =>
    list.map((topic) => formatArticleCard(topic))

  const fetchMoreTopics = async (page: number) => {
    const { allTopics: newTopics } = await fetchTopics({
      page,
      pageSize,
      isWithCount: false,
    })
    return formattedTopicsList(newTopics)
  }

  return (
    <>
      <section className={styles.list}>
        <InfiniteScrollList
          initialList={formattedTopicsList([...initTopicsList])}
          renderAmount={pageSize}
          fetchCount={topicsCount}
          fetchListInPage={fetchMoreTopics}
          loader={
            <div style={{ margin: '0 auto', width: '100vw' }}>
              <img src="/images/loading.svg" alt="loading page" />
            </div>
          }
        >
          {(renderList) => (
            <ol className={styles.topics}>
              {renderList.map((item) => (
                <li key={item.id}>
                  <UiTopicCard
                    href={item.href}
                    images={item.images}
                    title={item.title}
                    formattedBrief={item.brief}
                  />
                </li>
              ))}
            </ol>
          )}
        </InfiniteScrollList>
      </section>
    </>
  )
}

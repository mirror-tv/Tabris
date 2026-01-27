'use client'
import Image from 'next/image'
import InfiniteScrollList from '@readr-media/react-infinite-scroll-list'
import { fetchTopics } from '~/app/_actions/topic'
import UiTopicCard from '~/components/topic/ui-topic-card'
import { Topic } from '~/graphql/query/topic'
import styles from './_styles/topics-list-manager.module.scss'
import type { ApiData } from '~/types/api-data'
import type { PostImage } from '~/utils'
import { formatePostImage, handleApiData } from '~/utils'

type TopicsListManagerProps = {
  pageSize: number
  topicsCount: number
  initTopicsList: Topic[]
}

type FormatTopicCard = {
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

  const formatTopicCard = (topic: Topic): FormatTopicCard => {
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
    list.map((topic) => formatTopicCard(topic))

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
        <InfiniteScrollList<FormatTopicCard>
          initialList={formattedTopicsList([...initTopicsList])}
          pageSize={pageSize}
          amountOfElements={topicsCount}
          fetchListInPage={fetchMoreTopics}
          loader={
            <div className={styles.loading}>
              <Image
                src="/images/loading.svg"
                alt="loading page"
                width="200"
                height="200"
                priority
              />
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

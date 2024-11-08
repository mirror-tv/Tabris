import { type FeatureTopic } from '~/graphql/query/topic'
import styles from './_styles/topic-list.module.scss'
import UiHeadingBordered from '~/components/shared/ui-heading-bordered'
import TopicItem from './topic-item'
import { getFeatureTopics } from '~/app/_actions/homepage/feature-topics'

type TopicListProps = {
  title: string
}

export default async function TopicList({ title }: TopicListProps) {
  let allTopics: FeatureTopic[] | undefined = []

  try {
    const response = await getFeatureTopics({ topicFirst: 4, postFirst: 3 })
    allTopics = response?.data?.allTopics
  } catch (error) {
    return null
  }

  if (!allTopics?.[0]) {
    return null
  }

  return (
    <section className={styles.container}>
      <div className={styles.titleWrapper}>
        <UiHeadingBordered title={title} className={styles.listTitle} />
      </div>
      <div>
        <TopicItem isFirst={true} topic={allTopics[0]} />
        <div className={styles.list}>
          {allTopics.slice(1).map((topic) => {
            return <TopicItem isFirst={false} topic={topic} key={topic.slug} />
          })}
        </div>
      </div>
    </section>
  )
}

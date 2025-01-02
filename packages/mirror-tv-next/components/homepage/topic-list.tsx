import { type FeatureTopic } from '~/graphql/query/topic'
import styles from './_styles/topic-list.module.scss'
import UiHeadingBordered from '~/components/shared/ui-heading-bordered'
import TopicItem from './topic-item'

type TopicListProps = {
  title: string
  allTopics: FeatureTopic[] | undefined
}

export default async function TopicList({ title, allTopics }: TopicListProps) {
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

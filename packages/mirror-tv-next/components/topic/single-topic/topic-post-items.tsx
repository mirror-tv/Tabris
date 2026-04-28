import { fetchSortDir, fetchTopicItems } from '~/app/_actions/signal-topic'
import MoreItemsManager from '~/components/topic/single-topic/more-items-manager'
import type { Post, PostOrderByInput } from '~/graphql/query/topic'

type Props = {
  slug: string
  itemsCount: number
}

export default async function TopicPostItems({ slug, itemsCount }: Props) {
  const PAGE_SIZE = 12
  let itemsList: Post[] = []
  let sortBy: PostOrderByInput = { publishTime: 'desc' }

  try {
    const data = await fetchSortDir({
      slug: slug,
    })

    const sortDir = data.sortDir

    sortBy =
      sortDir === 'asc' ? { publishTime: 'asc' } : { publishTime: 'desc' }

    try {
      const topicItemsData = await fetchTopicItems({
        page: 1,
        pageSize: PAGE_SIZE,
        slug: slug,
        sortBy,
      })

      itemsList = topicItemsData.items
    } catch (error) {
      console.error('Error fetching topic items:', error)
    }
  } catch (error) {
    console.error('Error fetching sort direction:', error)
  }

  return (
    <MoreItemsManager
      initialPostItems={itemsList}
      slug={slug}
      itemsCount={itemsCount}
      sortBy={sortBy}
    />
  )
}

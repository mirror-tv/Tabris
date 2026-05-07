import { fetchPromoteTopics } from '~/app/_actions/promote-topic'
import PromoteTopicSwiper from './swiper'

export default async function PromoteTopic() {
  const list = await fetchPromoteTopics()

  if (!list.length) return null

  return <PromoteTopicSwiper list={list} />
}

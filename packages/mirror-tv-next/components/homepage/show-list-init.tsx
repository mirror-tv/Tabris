import styles from './_styles/show-list-init.module.scss'
import UiHeadingBordered from '~/components/shared/ui-heading-bordered'
import { getShows } from '~/app/_actions/homepage/shows'
import { Show } from '~/graphql/query/shows'
import ShowListHandler from './show-list-handler'

type ShowListProps = {
  title: string
}

export default async function ShowListInit({ title }: ShowListProps) {
  let initShows: Show[] = []
  let showsCount: number = 0
  try {
    const response:
      | { data: { allShows: Show[]; _allShowsMeta?: { count: number } } }
      | undefined = await getShows({
      take: 12,
      skip: 0,
      isGetCount: true,
    })
    initShows = response?.data?.allShows ?? []
    showsCount = response?.data?._allShowsMeta?.count ?? 0
  } catch {
    return null
  }

  if (!showsCount) return null

  return (
    <section className={styles.container}>
      <div className={styles.titleWrapper}>
        <UiHeadingBordered title={title} className={styles.listTitle} />
      </div>
      <div className={styles.list}>
        <ShowListHandler initShows={initShows} showsCount={showsCount} />
      </div>
    </section>
  )
}

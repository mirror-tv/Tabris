'use client'
import styles from './_styles/show-list-init.module.scss'
import UiHeadingBordered from '~/components/shared/ui-heading-bordered'
import ShowListHandler from './show-list-handler'
import { useData } from '~/context/data-context'
import type { Show } from '~/types/header'

type ShowListProps = {
  title: string
}

export default function ShowListInit({ title }: ShowListProps) {
  const { headerData } = useData()
  const initShows: Show[] = headerData.allShows
  const showsCount: number = headerData.allShows.length

  if (!showsCount) return null

  return (
    <section className={styles.container}>
      <div className={styles.titleWrapper}>
        <UiHeadingBordered title={title} className={styles.listTitle} />
      </div>
      <div className={`${styles.list} show-list`}>
        <ShowListHandler initShows={initShows} showsCount={showsCount} />
      </div>
    </section>
  )
}

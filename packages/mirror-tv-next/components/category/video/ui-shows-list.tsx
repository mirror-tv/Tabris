'use client'
import UiShowCard from './ui-show-card'
import UiHeadingBordered from '~/components/shared/ui-heading-bordered'
import styles from './_styles/ui-show-cards-list.module.scss'
import { useData } from '~/context/data-context'

type UiShowsListProps = {
  title: string
}

export default function UiShowsList({ title }: UiShowsListProps) {
  const { headerData } = useData()
  const showsList = headerData?.allShows ?? []
  if (!showsList.length) return null
  return (
    <>
      <UiHeadingBordered title={title} className={styles.title} />
      <div className={`${styles.list} show-card`}>
        {showsList.map((showItem) => {
          return (
            <UiShowCard
              key={showItem.slug}
              id={showItem.id}
              slug={showItem.slug}
              name={showItem.name}
              bannerImg={showItem.bannerImg ?? {}}
            />
          )
        })}
      </div>
    </>
  )
}

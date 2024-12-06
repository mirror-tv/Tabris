import type { Category } from '~/graphql/query/category'
import styles from './_styles/header-nav.module.scss'
import NavItems from './nav-items'

type HeaderNavProps = {
  categories: Category[]
}

export default function HeaderNav({ categories }: HeaderNavProps) {
  return (
    <ul className={styles.ul}>
      <NavItems categories={categories} />
    </ul>
  )
}

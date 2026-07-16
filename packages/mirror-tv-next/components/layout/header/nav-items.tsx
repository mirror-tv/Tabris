'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { Category } from '~/graphql/query/category'
import styles from './_styles/nav-items.module.scss'
import DesktopSearchBar from './desktop-search-bar'
import { useData } from '~/context/data-context'
import type { Show } from '~/types/header'

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

const CategoryNavItem = memo(function CategoryNavItem({
  category,
  isActive,
}: {
  category: Category
  isActive: boolean
}) {
  return (
    <div className={`${styles.li} ${isActive ? styles.active : ''}`}>
      <Link
        href={`/category/${category.slug}`}
        prefetch={false}
        className={`category-nav__link ${
          category.style === 'highlight' ? styles.highlight : ''
        }`}
      >
        {category.name}
      </Link>
    </div>
  )
})

type NavItemProps = {
  categories: Category[]
}

export default function NavItems({ categories }: NavItemProps) {
  const path = usePathname()
  const { headerData } = useData()
  const shows = useMemo<Show[]>(
    () => (headerData?.allShows ?? []).filter((show) => !show.listShow),
    [headerData]
  )

  const [showRest, setShowRest] = useState(false)
  const [showBox, setShowBox] = useState(false)
  // Start collapsed so the first paint never shows every item expanded.
  const [renderedCategoryIndex, setRenderedCategoryIndex] = useState(0)
  const [isReady, setIsReady] = useState(false)

  // The actual row that renders items. We measure its real content width so
  // the search bar's flex squeeze is already reflected — no manual subtract.
  const visibleItemsRef = useRef<HTMLDivElement>(null)
  // Hidden measurement layer that mirrors ALL items (fixed + categories).
  const measureListRef = useRef<HTMLUListElement>(null)

  const handleShowBox = () => setShowBox(true)
  const handleHideBox = () => setShowBox(false)
  const handleSeeMoreClick = () => setShowRest((prev) => !prev)

  const resetRenderedCategory = useCallback(() => {
    const listElement = measureListRef.current
    const row = visibleItemsRef.current
    if (!listElement || !row) return

    const allItems = Array.from(listElement.getElementsByTagName('li'))
    const fixedItems = allItems.filter((el) => el.dataset.fixed)
    const categoryItems = allItems.filter((el) => el.dataset.category)

    const widthOf = (el: Element) => el.getBoundingClientRect().width

    // Fixed cost: 影音 + 節目列表 + 看更多 always reserved up front.
    const fixedWidth = fixedItems.reduce((sum, el) => sum + widthOf(el), 0)

    // Measure the row itself: its clientWidth is what's left AFTER the search
    // bar took its share, so we don't subtract searchWidth manually.
    const available = row.clientWidth
    // Safety buffer so we never fit categories "too tightly" and push
    // 看更多 out of view. Better to show one fewer than to lose 看更多.
    const SAFETY_BUFFER = 24
    const budget = available - fixedWidth - SAFETY_BUFFER

    // Fill the middle budget with as many categories as fit.
    let used = 0
    let count = 0
    for (const item of categoryItems) {
      const w = widthOf(item)
      if (used + w <= budget) {
        used += w
        count++
      } else {
        break
      }
    }

    setRenderedCategoryIndex(count)
  }, [])

  // Measure before paint; re-measure on container resize and font load.
  useIsomorphicLayoutEffect(() => {
    const row = visibleItemsRef.current
    if (!row) return

    resetRenderedCategory()
    setIsReady(true)

    let ro: ResizeObserver | null = null
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(() => resetRenderedCategory())
      ro.observe(row)
    }

    if ('fonts' in document) {
      document.fonts.ready.then(() => resetRenderedCategory())
    }

    return () => {
      if (ro) ro.disconnect()
    }
  }, [categories, resetRenderedCategory])

  const columns = useMemo(() => {
    const result: Show[][] = []
    const showsPerColumn = 7
    if (Array.isArray(shows)) {
      for (let i = 0; i < shows.length; i += showsPerColumn) {
        result.push(shows.slice(i, i + showsPerColumn))
      }
    }
    return result
  }, [shows])

  return (
    <div className={styles.itemWrapper}>
      <div className={styles.navWrapper}>
        {/* Hidden measurement layer: mirrors every item so all widths are real. */}
        <ul ref={measureListRef} className={styles.hidden} aria-hidden="true">
          <li className={styles.li} data-fixed="video">
            <span className="category-nav__link">影音</span>
          </li>
          {categories.map((category) => (
            <li key={category.id} className={styles.li} data-category="1">
              <span className="category-nav__link">{category.name}</span>
            </li>
          ))}
          <li className={styles.showLi} data-fixed="shows">
            節目列表
          </li>
          <li className={`${styles.li} ${styles.grey}`} data-fixed="more">
            看更多
          </li>
        </ul>

        <div
          ref={visibleItemsRef}
          className={`${styles.visibleItems} ${isReady ? styles.ready : ''}`}
        >
          <div
            className={`${styles.li} ${
              path === '/category/video' ? styles.active : ''
            }`}
          >
            <Link
              href="/category/video"
              prefetch={false}
              className="category-nav__link"
            >
              影音
            </Link>
          </div>

          {categories.slice(0, renderedCategoryIndex).map((category) => (
            <CategoryNavItem
              key={category.id}
              category={category}
              isActive={path === `/category/${category.slug}`}
            />
          ))}

          <div>
            <div
              onMouseEnter={handleShowBox}
              onMouseLeave={handleHideBox}
              className={styles.showLi}
            >
              節目列表
            </div>
            {showBox && (
              <div
                className={styles.showBox}
                onMouseEnter={handleShowBox}
                onMouseLeave={handleHideBox}
              >
                {columns.map((column, columnIndex) => (
                  <ul key={columnIndex} className={styles.showColumn}>
                    {column.map((show) => (
                      <li key={show.id} className={styles.showItem}>
                        <Link href={`/show/${show.slug}`} prefetch={false}>
                          {show.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            )}
          </div>

          {categories.length > renderedCategoryIndex && (
            <div
              onClick={handleSeeMoreClick}
              className={`${styles.li} ${styles.grey}`}
            >
              看更多
            </div>
          )}
        </div>

        <DesktopSearchBar />
      </div>

      <div
        className={`${styles.restOfCategories} ${
          showRest ? styles.showRest : ''
        }`}
      >
        {categories.slice(renderedCategoryIndex).map((category) => {
          const isActive = path === `/category/${category.slug}`

          return (
            <div
              key={category.id}
              className={`${styles.liRest} ${isActive ? styles.activeRe : ''}`}
            >
              <Link
                href={`/category/${category.slug}`}
                prefetch={false}
                className="category-nav__link"
              >
                {category.name}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

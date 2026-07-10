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
import useWindowDimensions from '~/hooks/use-window-dimensions'
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
  const { width } = useWindowDimensions()
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
  const categoryListRef = useRef<HTMLUListElement>(null)

  const handleShowBox = () => {
    setShowBox(true)
  }

  const handleHideBox = () => {
    setShowBox(false)
  }

  const handleSeeMoreClick = () => {
    setShowRest((prevState) => !prevState)
  }

  const resetRenderedCategory = useCallback(() => {
    const isViewportWidthUpXl = width && width >= 1000

    // Desktop/Tablet view - calculate available space
    const maxWidth = isViewportWidthUpXl ? 800 : 450
    const otherItemWidth = isViewportWidthUpXl ? 300 : 160

    let firstLineItemCount = 0
    let currentWidth = 0
    const listElement = categoryListRef.current
    const items = Array.from(listElement?.getElementsByTagName('li') || [])

    for (const item of items) {
      const itemWidth = item.getBoundingClientRect().width || 0
      if (currentWidth + itemWidth + otherItemWidth <= maxWidth) {
        firstLineItemCount++
        currentWidth += itemWidth
      } else {
        break
      }
    }
    setRenderedCategoryIndex(firstLineItemCount)
  }, [width])

  // Measure before paint so the browser only draws the sliced result.
  useIsomorphicLayoutEffect(() => {
    resetRenderedCategory()
    setIsReady(true)
    window.addEventListener('resize', resetRenderedCategory)
    return () => {
      window.removeEventListener('resize', resetRenderedCategory)
    }
  }, [width, categories, resetRenderedCategory])

  // Splitting shows into multiple columns with 7 shows each
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
        <ul ref={categoryListRef} className={styles.hidden}>
          {categories.map((category) => {
            return (
              <li key={category.id} className={`${styles.li}`}>
                <span className="category-nav__link">{category.name}</span>
              </li>
            )
          })}
        </ul>
        <div
          className={`${styles.visibleItems} ${isReady ? styles.ready : ''}`}
        >
          <div
            className={`${styles.li} ${
              path === '/category/video' ? styles.active : ''
            }`}
          >
            <Link href="/category/video" className="category-nav__link">
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
                        <Link href={`/show/${show.slug}`}>{show.name}</Link>
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

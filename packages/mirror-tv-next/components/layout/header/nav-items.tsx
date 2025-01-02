'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { Category } from '~/graphql/query/category'
import styles from './_styles/nav-items.module.scss'
import DesktopSearchBar from './desktop-search-bar'
import useWindowDimensions from '~/hooks/use-window-dimensions'
import { useData } from '~/context/data-context'
import type { Show } from '~/types/header'

type NavItemProps = {
  categories: Category[]
}

export default function NavItems({ categories }: NavItemProps) {
  const path = usePathname()
  const { width } = useWindowDimensions()
  const { headerData } = useData()
  const shows: Show[] = headerData.allShows

  const [showRest, setShowRest] = useState(false)
  const [showBox, setShowBox] = useState(false)
  const [renderedCategoryIndex, setRenderedCategoryIndex] = useState(
    categories.length
  )
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

  const resetRenderedCategory = () => {
    const isViewportWidthUpXl = width && width >= 1200

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
  }

  useEffect(() => {
    window.addEventListener('resize', resetRenderedCategory)

    resetRenderedCategory()

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', resetRenderedCategory)
    }
  }, [width])

  // Splitting shows into multiple columns with 7 shows each
  const columns = []
  const showsPerColumn = 7

  if (Array.isArray(shows)) {
    for (let i = 0; i < shows.length; i += showsPerColumn) {
      columns.push(shows.slice(i, i + showsPerColumn))
    }
  }

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
        <div className={styles.visibleItems}>
          <li
            className={`${styles.li} ${
              path === '/category/video' ? styles.active : ''
            }`}
          >
            <Link href="/category/video" className="category-nav__link">
              影音
            </Link>
          </li>
          {categories.slice(0, renderedCategoryIndex).map((category) => {
            // Check if the category's slug matches the path
            const isActive = path === `/category/${category.slug}`

            return (
              <li
                key={category.id}
                className={`${styles.li} ${isActive ? styles.active : ''}`}
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="category-nav__link"
                >
                  {category.name}
                </Link>
              </li>
            )
          })}
          <div>
            <li
              onMouseEnter={handleShowBox}
              onMouseLeave={handleHideBox}
              className={styles.showLi}
            >
              節目列表
            </li>
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
            <li
              onClick={handleSeeMoreClick}
              className={`${styles.li} ${styles.grey}`}
            >
              看更多
            </li>
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
            <li
              key={category.id}
              className={`${styles.liRest} ${isActive ? styles.activeRe : ''}`}
            >
              <Link
                href={`/category/${category.slug}`}
                className="category-nav__link"
              >
                {category.name}
              </Link>
            </li>
          )
        })}
      </div>
    </div>
  )
}

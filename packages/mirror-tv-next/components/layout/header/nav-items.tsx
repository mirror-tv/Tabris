'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Category } from '~/graphql/query/category'
import type { Show } from '~/graphql/query/shows'
import styles from './_styles/nav-items.module.scss'
import DesktopSearchBar from './desktop-search-bar'

type NavItemProps = {
  categories: Category[]
  shows: Show[]
}

export default function NavItems({ categories, shows }: NavItemProps) {
  const path = usePathname()

  const [showRest, setShowRest] = useState(false)
  const [totalVisibleCategories, setTotalVisibleCategories] = useState(9)
  const [showBox, setShowBox] = useState(false)

  const handleShowBox = () => {
    setShowBox(true)
  }

  const handleHideBox = () => {
    setShowBox(false)
  }

  const handleSeeMoreClick = () => {
    setShowRest((prevState) => !prevState)
  }

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const tabletWidthThreshold = 1200

      if (width <= tabletWidthThreshold) {
        setTotalVisibleCategories(5) // Set totalVisibleCategories to 5 for tablet
      } else {
        setTotalVisibleCategories(9) // Set totalVisibleCategories to 9 for PC
      }
    }

    // Add event listener for resize to detect changes in viewport width
    window.addEventListener('resize', handleResize)

    // Call handleResize once initially to set the correct value on component mount
    handleResize()

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

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
          {categories.slice(0, totalVisibleCategories).map((category) => {
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

          {categories.length > totalVisibleCategories && (
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
        {categories.slice(totalVisibleCategories).map((category) => {
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

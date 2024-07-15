'use client'
import Image from 'next/image'
import CallbackImage from '@readr-media/react-image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HEADER_BOTTOM_LINKS } from '~/constants/constant'
import type { Category } from '~/graphql/query/category'
import type { Show } from '~/graphql/query/shows'
import type { Sponsor } from '~/graphql/query/sponsors'
import styles from './_styles/side-menu.module.scss'
import { formateHeroImage } from '~/utils'

type SideMenuProps = {
  categories: Category[]
  shows: Show[]
  sponsors: Sponsor[]
}

export default function SideMenu({
  categories,
  shows,
  sponsors,
}: SideMenuProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const path = usePathname()

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState)
  }
  useEffect(() => {
    setIsSidebarOpen(false) // Close sidebar when pathname changes
  }, [path])

  // Conditionally set the class based on isSidebarOpen
  const sidebarWrapperClasses = `${styles.sidebarWrapper} ${
    isSidebarOpen ? styles.sidebarOpen : ''
  }`

  const toggleButtonClasses = `${
    isSidebarOpen ? styles.activeToggleButton : styles.toggleButton
  }`

  // Splitting shows into multiple columns with 7 shows each
  const columns = []
  const showsPerColumn = 7

  for (let i = 0; i < shows.length; i += showsPerColumn) {
    columns.push(shows.slice(i, i + showsPerColumn))
  }

  // Bottom Links
  const bottomLinks = [
    { href: HEADER_BOTTOM_LINKS.ombuds, text: '公評人專區' },
    { href: HEADER_BOTTOM_LINKS.anchorperson, text: '鏡主播' },
    { href: HEADER_BOTTOM_LINKS.about, text: '關於我們' },
  ]

  const socialLinks = [
    {
      href: HEADER_BOTTOM_LINKS.fb,
      src: '/icons/icon-fb.svg',
      alt: 'facebook icon',
    },
    {
      href: HEADER_BOTTOM_LINKS.line,
      src: '/icons/icon-line.svg',
      alt: 'line icon',
    },
    {
      href: HEADER_BOTTOM_LINKS.ig,
      src: '/icons/icon-ig.svg',
      alt: 'instagram icon',
    },
    {
      href: HEADER_BOTTOM_LINKS.x,
      src: '/icons/icon-x.svg',
      alt: 'x(former twitter) icon',
    },
  ]

  return (
    <div>
      <button
        onClick={toggleSidebar}
        style={{ outline: 'none' }}
        className={toggleButtonClasses}
      >
        <Image
          src="/icons/side-menu-icon.svg"
          alt="menu icon"
          width={28}
          height={26}
          priority
        />
      </button>
      <div className={sidebarWrapperClasses}>
        {/* Sponsors Block */}
        <div className={styles.sponsorsBlock}>
          <div className={styles.sponsorsWrapper}>
            {sponsors.slice(0, 3).map((sponsor) => {
              const formattedLogo = formateHeroImage(sponsor.logo ?? {})
              return (
                <div key={sponsor.id}>
                  <Link
                    href={
                      sponsor.url
                        ? sponsor.url
                        : `/topic/${sponsor.topic?.slug}`
                    }
                    className={styles.sponsorItem}
                  >
                    <CallbackImage
                      alt="Sponsor Logo"
                      images={formattedLogo}
                      loadingImage="/images/loading.svg"
                      defaultImage="/images/image-default.jpg"
                      rwd={{ default: '100px' }}
                      priority={true}
                    />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        {/* Categories Block */}
        <ul className={styles.categoriesBlock}>
          <div className={styles.categoriesWrapper}>
            <li
              className={`${styles.li} ${
                path === '/category/video' ? styles.active : ''
              }`}
            >
              <Link href="/category/video" className="category-nav__link">
                影音
              </Link>
            </li>
            {categories.map((category) => {
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
          </div>
        </ul>

        {/* Shows Block */}
        <div className={styles.showsBlock}>
          {columns.map((column, columnIndex) => (
            <ul key={columnIndex} className={styles.showColumn}>
              {column.map((show) => {
                // Check if the show's slug matches the path
                const isActive = path === `/show/${show.slug}`

                return (
                  <li
                    key={show.id}
                    className={`${styles.showItem} ${
                      isActive ? styles.activeShow : ''
                    }`}
                  >
                    <Link href={`/show/${show.slug}`}>{show.name}</Link>
                  </li>
                )
              })}
            </ul>
          ))}
        </div>

        {/* Bottom Block */}
        <div className={styles.bottomBlock}>
          <ul className={styles.items}>
            {bottomLinks.map((link, index) => (
              <li className={styles.otherLi} key={index}>
                <Link href={link.href}>{link.text}</Link>
              </li>
            ))}
          </ul>
          <ul className={styles.iconsWrapper}>
            {socialLinks.map((link, index) => (
              <li className={styles.icon} key={index}>
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image src={link.src} alt={link.alt} width={20} height={20} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

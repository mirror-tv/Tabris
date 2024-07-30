'use client'

import useWindowDimensions from '~/hooks/use-window-dimensions'
import ResponsiveImage from '../shared/responsive-image'
import Link from 'next/link'
import type { FormattedPostCard } from '~/utils'
import styles from './_styles/no-search-result-list.module.scss'
type NoSearchResultListProps = {
  formattedPosts: FormattedPostCard[]
}

const NoSearchResultList = ({ formattedPosts }: NoSearchResultListProps) => {
  const { width = 0 } = useWindowDimensions()
  const isDesktop = width > 1200
  const formattedPostsCount = isDesktop ? 4 : 3
  return (
    <ul className={styles.popularResultList}>
      {formattedPosts.slice(0, formattedPostsCount).map((article) => {
        return (
          <Link
            key={article.slug}
            href={article.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            <li>
              <ResponsiveImage
                images={article.images}
                alt={article.name}
                priority={false}
                rwd={{
                  mobile: '500px',
                  tablet: '500px',
                  laptop: '500px',
                  desktop: '500px',
                  default: '500px',
                }}
              />
            </li>
            <p>{article.name}</p>
          </Link>
        )
      })}
    </ul>
  )
}

export default NoSearchResultList

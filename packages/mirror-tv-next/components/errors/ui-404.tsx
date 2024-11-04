'use client'

import { Varela_Round } from 'next/font/google'
import Image from 'next/image'

import Link from 'next/link'
import ResponsiveImage from '~/components/shared/responsive-image'
import styles from './_styles/ui-404.module.scss'
import type { FormattedPostCard } from '~/utils'
import { formatArticleCard } from '~/utils'
import { useData } from '~/context/data-context'

const font = Varela_Round({ subsets: ['latin'], weight: '400' })

export default function Ui404() {
  const { popularPosts } = useData()
  const formattedPosts: FormattedPostCard[] = popularPosts.map((post) =>
    formatArticleCard(post)
  )

  return (
    <div className={`${font.className} ${styles.error}`}>
      <div className={styles.container}>
        <div className={styles.error_info}>
          <h1 className={styles.error_info_heading}>404</h1>
          <a href="/" className={styles.error_info_link}>
            HOME
          </a>
        </div>

        <div className={styles.article_container}>
          <h3>熱門新聞</h3>
          <div className={styles.article_list}>
            {formattedPosts.slice(0, 3).map((article) => {
              return (
                <Link
                  key={article.slug}
                  href={article.href}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <div className={styles.img}>
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
                  </div>

                  <p>{article.name}</p>
                </Link>
              )
            })}
          </div>
        </div>

        <div className={styles.error__wire_left}>
          <Image
            src="/icons/plug.svg"
            width={120}
            height={90}
            alt="plug icon"
            className={`${styles.error__icon} ${styles.plug}`}
          />
          <div className={styles.error__wire_1} />
          <div className={styles.error__wire_2} />
        </div>

        <div className={styles.error__wire_right}>
          <Image
            src="/icons/socket.svg"
            width={93}
            height={90}
            alt="socket icon"
            className={`${styles.error__icon} ${styles.socket}`}
          />
          <div className={styles.error__wire_1} />
          <div className={styles.error__wire_2} />
        </div>
      </div>
    </div>
  )
}

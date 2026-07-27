'use client'

import { Varela_Round } from 'next/font/google'
import Image from 'next/image'

import Link from '~/components/shared/link'
import styles from './_styles/ui-404.module.scss'
import { useData } from '~/context/data-context'
import NextResponsiveImage from '../shared/next-responsive-image'

const font = Varela_Round({ subsets: ['latin'], weight: '400' })

export default function Ui404() {
  const { popularPosts } = useData()

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
            {popularPosts.slice(0, 3).map((article) => {
              return (
                <Link
                  key={article.slug}
                  href={`/story/${article.slug}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <NextResponsiveImage
                    fill
                    className={styles.img}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="/images/loading.svg"
                    src={
                      article.heroImage?.replace(/\.(jpg|png)$/i, '.webP') ??
                      '/images/image-default.jpg'
                    }
                    sizes="(max-width: 768px) 50vw, 30vw"
                    srcSet={[480, 800]}
                    alt={article.name}
                    priority={false}
                    fallback={article.heroImage}
                    fetchPriority="high"
                  />

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

'use client'
import Aside from '~/components/story/aside'
import styles from './_styles/story.module.scss'

export default function StoryPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.LayoutWrapper}>
      <section className={styles.story}>
        <main className={styles.article}>{children}</main>
        <Aside />
      </section>
    </div>
  )
}

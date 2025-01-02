import Aside from '~/components/story/aside'
import styles from './_styles/story.module.scss'

export default function StoryPageLayout({
  children,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  return (
    <div className={styles.wrapper}>
      <section className={styles.story}>
        <main className={styles.article}>{children}</main>
        <Aside />
      </section>
    </div>
  )
}

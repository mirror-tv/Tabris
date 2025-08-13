import { ENV } from '~/constants/environment-variables'
import styles from './_styles/recall-iframe.module.scss'

export default async function RecallIframe() {
  const iframeSrc =
    ENV === 'dev' || ENV === 'local'
      ? `https://dev.mnews.tw/projects/election2025-homepage/index.html?source=mirror`
      : `https://www.mnews.tw/projects/election2025-homepage/index.html?source=mirror`
  const linkHref =
    ENV === 'dev' || ENV === 'local'
      ? `https://dev.mnews.tw/projects/dev-taiwan-elections/index.html`
      : `https://www.mnews.tw/projects/taiwan-elections/index.html`
  return (
    <section className={styles.container}>
      <h2 id="special-event-title" className={styles.title}>
        2025 鏡週刊立委罷免即時開票
      </h2>
      <iframe src={iframeSrc} className={styles.iframe}></iframe>
      <a
        className={`GTM-click_2025_election_page ${styles.more}`}
        href={linkHref}
        target="_blank"
        rel="noreferrer noopener"
      >
        查看完整資料
      </a>
    </section>
  )
}

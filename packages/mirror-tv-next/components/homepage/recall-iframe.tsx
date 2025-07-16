import styles from './_styles/recall-iframe.module.scss'

export default async function RecallIframe() {
  return (
    <section className={styles.container}>
      <h2 id="special-event-title" className={styles.title}>
        2025 鏡週刊立委罷免即時開票
      </h2>
      <iframe
        src="https://www.mirrormedia.mg/projects/election2024-homepage/index.html"
        className={styles.iframe}
      ></iframe>
      <a
        className={styles.more}
        href="https://scontent.ftpe14-1.fna.fbcdn.net/v/t39.30808-6/518320938_3477371905738930_8316813337412471517_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=8H2JU2Z7i-YQ7kNvwETTFc3&_nc_oc=AdleVbwTbaFha34fY2NCvc30b7B2oc7qZREgml-9y9dtJwn57QAiem-paimlWCQOB4g&_nc_zt=23&_nc_ht=scontent.ftpe14-1.fna&_nc_gid=tfb1v3KcxgmoKTSVJrK9aQ&oh=00_AfTSxzgYWV9CFQruwyFPOco-8b3Zpxyk5_QTv11pJjXrlw&oe=687D12E2"
        target="_blank"
        rel="noreferrer noopener"
      >
        查看完整資料
      </a>
    </section>
  )
}

import styles from './_styles/ombuds-intro.module.scss'
import Link from '~/components/shared/link'
import { CUSTOMER_SERVICE_EMAIL } from '~/constants/constant'
import Image from 'next/image'

export default function ombudsIntro() {
  return (
    <section className={styles.ombudsIntroContent}>
      <h1>外部公評人莊豐嘉</h1>
      <div className={styles.mainIntroWrapper}>
        <section className={styles.ombudsIntroWrapper}>
          <div className={styles.imageWrapper}>
            <Image
              src="/images/om-portrait.jpg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 384px, 480px"
              priority
              style={{ objectFit: 'cover' }}
              fill
              alt="鏡新聞外部公評人莊豐嘉"
            />
          </div>

          <article className={styles.introArticle}>
            <p>
              莊豐嘉為資深媒體人，曾任華視總經理、新頭殼新聞網總製作、中央社副總編輯、台灣日報總編輯等媒體高層職務，2026年9月1日起，擔任鏡電視新聞台外部公評人。主要工作在確保新聞內容符合正確、平衡、公平和好的品味，並代表閱聽人的利益，處理公眾申訴案件，扮演閱聽眾和電視台之間的溝通橋梁。外部公評人獨立於鏡電視新聞台，直接向董事會負責，任期三年，得連任。
            </p>
            <div className={styles.linkWrapper}>
              <Link
                href="/story/biography"
                target="_blank"
                rel="noreferrer noopener"
                className="ombuds__intro__main__wrapper-info--btn"
              >
                了解更多
              </Link>
            </div>
          </article>
        </section>

        <section className={styles.reportIssue}>
          <h3>我要向公評人申訴</h3>
          <div className={styles.contentWrapper}>
            <div className={styles.mainContent}>
              <p>
                如果您對於我們的新聞內容有意見，例如：事實錯誤、侵害人權，或違反新聞倫理等，請按下方的向公評人申訴鍵。
              </p>
              <Link
                href="/story/complaint"
                target="_blank"
                rel="noreferrer noopener"
                className={`${styles.reportLink} ombuds__intro__aside__content-main--btn`}
              >
                向公評人申訴
              </Link>
            </div>
            <div className={styles.contact}>
              <p>客服事項請打客服專線：</p>
              <p className={styles.tel}>（02）7752-5678</p>
              <p>或洽客服信箱</p>
              <Link
                href={`mailto:${CUSTOMER_SERVICE_EMAIL}`}
                className={styles.reportMail}
              >
                {CUSTOMER_SERVICE_EMAIL}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}

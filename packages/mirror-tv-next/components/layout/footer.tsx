import Image from 'next/image'
import Link from 'next/link'
import { HEADER_BOTTOM_LINKS } from '~/constants/constant'
import styles from './_styles/footer.module.scss'

const footerRightList = [
  { href: '/schedule', gaText: 'schedule', text: '電視節目表' },
  {
    href: '/story/press-self-regulation',
    text: '新聞自律',
  },
  { href: '/story/channel', text: '頻道位置' },
  { href: '/story/privacy', text: '隱私權政策' },
  {
    href: '/story/webauthorization',
    text: '內容授權',
  },

  {
    href: '/story/announce',
    text: '公告專區',
  },
  { href: '/story/adsales', text: '整合行銷' },
]

const socialLinks = [
  {
    href: HEADER_BOTTOM_LINKS.fb,
    src: '/icons/icon-fb.svg',
    alt: 'facebook icon',
  },
  {
    href: HEADER_BOTTOM_LINKS.line,
    src: '/icons/icon-line-dark.svg',
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

export default function Footer(): JSX.Element {
  return (
    <footer className={[styles.footer, 'footer'].join(' ')}>
      <div className={[styles.topWrapper, 'top-wrapper'].join(' ')}>
        <div className={styles.topInnerWrapper}>
          <div className={styles.left}>
            <div className={styles.logo}>
              <Link href="/">
                <Image
                  src="/icons/mnews-logo-white.svg"
                  alt="mnews logo"
                  priority
                  width={163}
                  height={30}
                />
              </Link>
            </div>
            <div
              className={`${styles.iconsWrapper} footer__top-wrapper top-wrapper`}
            >
              {socialLinks.map((link, index) => (
                <li className={styles.icon} key={index}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={link.src}
                      alt={link.alt}
                      width={20}
                      height={20}
                    />
                  </Link>
                </li>
              ))}
            </div>
          </div>

          <div className={styles.middleWrapper}>
            <div className={styles.infoWrapper}>
              <p className={styles.info}>
                <span>客服專線: </span>
                <span>(02)7752-5678 </span>
              </p>
              <p className={styles.info}>
                <span>客服信箱: </span>
                <a href="mailto:mnews.cs@mnews.com.tw">mnews.cs@mnews.com.tw</a>
              </p>
            </div>
          </div>
        </div>
        <div
          className={[styles.right, 'top-wrapper__right', 'right'].join(' ')}
        >
          {footerRightList.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              {item.text}
            </a>
          ))}
        </div>
        <div
          className={[
            styles.mobileIconsWrapper,
            'footer__top-wrapper',
            'top-wrapper',
          ].join(' ')}
        >
          {socialLinks.map((link, index) => (
            <li className={styles.icon} key={index}>
              <Link href={link.href} target="_blank" rel="noopener noreferrer">
                <Image src={link.src} alt={link.alt} width={20} height={20} />
              </Link>
            </li>
          ))}
        </div>
      </div>
      <div className={styles.bottomWrapper}>
        <div className={styles.texts}>
          <div className={styles.copyright}>
            <span>©Mirror TV BROADCASTING LTD.</span>
            <span>All Rights Reserved.</span>
            <span>鏡電視股份有限公司 版權所有</span>
          </div>
          <p className={styles.youtubeTos}>
            本網頁使用{' '}
            <a
              href="https://developers.google.com/youtube/terms/developer-policies#definition-youtube-api-services"
              target="_blank"
              rel="noreferrer noopener"
            >
              YouTube API 服務
            </a>
            ，詳見{' '}
            <a
              href="https://www.youtube.com/t/terms"
              target="_blank"
              rel="noreferrer noopener"
            >
              YouTube 服務條款
            </a>
            、
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer noopener"
            >
              Google 隱私權與條款
            </a>
            <br />
            <span className={styles.agree}>
              瀏覽此頁面即代表您同意上述授權條款及細則
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}

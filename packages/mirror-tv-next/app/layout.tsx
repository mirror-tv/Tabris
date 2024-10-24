import { GoogleTagManager } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import Script from 'next/script'
import Footer from '~/components/layout/footer'
import MainHeader from '~/components/layout/header/main-header'
import { META_DESCRIPTION, SITE_TITLE } from '~/constants/constant'
import {
  GLOBAL_CACHE_SETTING,
  GTM_ID,
  SITE_URL,
  LOTTERY_FEATURE_TOGGLE,
  ENV,
} from '~/constants/environment-variables'
import '../styles/global.css'
import CompassFit from '~/components/ads/compass-fit'
import TagManagerWrapper from './tag-manager'
import Counter from '~/components/layout/lottery/counter'

export const revalidate = GLOBAL_CACHE_SETTING

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: META_DESCRIPTION,
  openGraph: {
    images: {
      url: '/images/default-og-img.jpg',
    },
  },
}

const noto_sans = Noto_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const now = new Date()
  let targetDate
  if (ENV === 'prod') {
    targetDate = new Date('2024-10-24T12:00:00+08:00')
  } else if (ENV === 'staging') {
    targetDate = new Date('2024-10-24T11:30:00+08:00')
  } else {
    targetDate = new Date('2024-10-23T13:00:00+08:00')
  }

  return (
    <html lang="zh-Hant" className={`${noto_sans.variable} `}>
      <GoogleTagManager gtmId={GTM_ID} />
      <Script
        async
        src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
      />
      <Script id="gpt-setup">
        {`
        window.googletag = window.googletag || {cmd: []};
        window.googletag.cmd.push(() => {
          /**
           * Do not use lazy loading with SRA.
           *
           * With lazy loading in SRA,
           * GPT will fetching multiple ads at the same time,
           * which cause the call for the first ad and all other ad slots is made.
           * https://developers.google.com/doubleclick-gpt/reference#googletag.PubAdsService_enableSingleRequest
           */
          // window.googletag.pubads().enableSingleRequest()

          window.googletag.pubads().enableLazyLoad({
            // Fetch slots within 1.5 viewports.
            fetchMarginPercent: 150,

            // Render slots within 1 viewports.
            renderMarginPercent: 100,

            /**
             * Double the above values on mobile, where viewports are smaller
             * and users tend to scroll faster.
             */
            mobileScaling: 2.0,
          })
          window.googletag.pubads().collapseEmptyDivs()
          window.googletag.enableServices()

          
        })`}
      </Script>
      <Script id="comscore">
        {`var _comscore = _comscore || [];
        _comscore.push({
        c1: "2", c2: "35880649", cs_ucfr: "1",
        options: {
        enableFirstPartyCookie: true
        }
        });
        (function() {
        var s = document.createElement("script"), el =
        document.getElementsByTagName("script")[0];
        s.async = true;
        s.src = "https://sb.scorecardresearch.com/cs/CLIENT_ID/beacon.js";
        el.parentNode.insertBefore(s, el);
        })();`}
      </Script>
      <body>
        <>
          <MainHeader />
          <TagManagerWrapper />
          {children}
          <Footer />
          {LOTTERY_FEATURE_TOGGLE === 'on' && now > targetDate && <Counter />}
          <CompassFit />
        </>
      </body>
    </html>
  )
}

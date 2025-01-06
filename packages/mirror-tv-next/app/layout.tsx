import { DataProvider } from '~/context/data-context'
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
  HEADER_JSON_URL,
  SITE_URL,
} from '~/constants/environment-variables'
import '../styles/global.css'
import CompassFit from '~/components/ads/compass-fit'
import TagManagerWrapper from './tag-manager'
import { fetchPopularPosts } from '~/app/_actions/popular-data'
import { type RawPopularPost } from '~/types/popular-post'
import { getLatestPostsForAside } from './_actions/category/get-latest-posts'
import { type PostCardItem } from '~/graphql/query/posts'
import type { HeaderData } from '~/types/header'
import { handleResponse } from '~/utils'

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let initialPopularPosts: RawPopularPost[] = []
  let initialLatestPosts: PostCardItem[] = []
  let initialHeaderData: HeaderData = {
    allCategories: [],
    allShows: [],
    allSponsors: [],
  }

  const [popularPostsResult, latestPostsResult] = await Promise.allSettled([
    fetchPopularPosts(),
    getLatestPostsForAside(),
  ])

  const getDataFromPopularPostsResult = (
    value: Awaited<ReturnType<typeof fetchPopularPosts>> | undefined
  ) => value?.data || []
  const getAllPostsFromLatestPostsResult = (
    value: Awaited<ReturnType<typeof getLatestPostsForAside>> | undefined
  ) => value?.data.allPosts || []

  initialPopularPosts = handleResponse(
    popularPostsResult,
    getDataFromPopularPostsResult,
    'Error occurs while fetching popular posts'
  )
  initialLatestPosts = handleResponse(
    latestPostsResult,
    getAllPostsFromLatestPostsResult,
    'Error occurs while fetching latest posts'
  )
  try {
    const data = await fetch(HEADER_JSON_URL, {
      next: { revalidate: GLOBAL_CACHE_SETTING },
    }).then((res) => {
      // use type assertion to eliminate any
      return res.json() as unknown as HeaderData
    })
    initialHeaderData = data
  } catch (error) {
    console.error('Failed to fetch popular posts:', error)
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
        <DataProvider
          initialPopularPosts={initialPopularPosts}
          initialLatestPosts={initialLatestPosts}
          initialHeaderData={initialHeaderData}
        >
          <MainHeader />
          <TagManagerWrapper />
          {children}
          <Footer />
          <CompassFit />
        </DataProvider>
      </body>
    </html>
  )
}

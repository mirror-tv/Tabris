'use client'
import UiHeadingBordered from '../shared/ui-heading-bordered'
import { SinglePost } from '~/graphql/query/story'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'

import styles from './_styles/article-related-posts.module.scss'
import useWindowDimensions from '~/hooks/use-window-dimensions'

const LazyRenderWrapper = dynamic(
  () => import('~/components/shared/lazy-render-wrapper'),
  {
    ssr: false,
  }
)

const ArticleRelatedPosts = ({
  relatedPosts,
  shouldShowAds,
}: {
  relatedPosts: SinglePost['relatedPosts']
  shouldShowAds: boolean
}) => {
  const { width } = useWindowDimensions()
  const popinRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (popinRef.current && shouldShowAds) {
      const initPopinAd = () => {
        console.log('PopIn 初始化開始...')

        // 檢查 PopIn 腳本是否已載入
        const popinScript = document.getElementById('popin-recommend')
        if (popinScript) {
          console.log('PopIn 腳本已載入')
        } else {
          console.log('PopIn 腳本未載入，嘗試手動載入')
          // 手動載入 PopIn 腳本
          const script = document.createElement('script')
          script.id = 'popin-recommend'
          script.src = 'https://api.popin.cc/recommend/mnews.js'
          script.async = true
          document.head.appendChild(script)
        }
      }

      // 延遲初始化，讓內嵌腳本有時間執行
      setTimeout(initPopinAd, 1000)
    }
  }, [shouldShowAds])

  return (
    <div className={styles.container}>
      <UiHeadingBordered title={'更多新聞'} className={styles.listTitle} />
      <ul>
        {relatedPosts.map((item, idx) => (
          <li key={item.slug + idx}>{item.name}</li>
        ))}
      </ul>

      {shouldShowAds && (
        <>
          <LazyRenderWrapper>
            <div id="_popIn_recommend_word" ref={popinRef}>
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    (function(d,s,id){
                      var js,fjs=d.getElementsByTagName(s)[0];
                      if(d.getElementById(id)) return;
                      js=d.createElement(s); js.id=id;
                      js.src="https://api.popin.cc/recommend/mnews.js";
                      fjs.parentNode.insertBefore(js,fjs);
                    }(document,'script','popin-recommend'));
                  `,
                }}
              />
            </div>
            <div
              className="avivid_textad avivid_ad_one"
              data-web_id="mnewstext"
            />
            {width && width >= 768 ? (
              <div id="compass-fit-4333664" />
            ) : (
              <div id="compass-fit-4333665" />
            )}
          </LazyRenderWrapper>
        </>
      )}
    </div>
  )
}

export default ArticleRelatedPosts

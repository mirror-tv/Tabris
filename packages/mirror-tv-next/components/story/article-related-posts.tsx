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
        console.log('window.popin:', window.popin)
        console.log('window.popinRecommend:', window.popinRecommend)

        // 嘗試多種初始化方法
        if (window.popin && window.popin.init) {
          console.log('執行 window.popin.init()')
          window.popin.init()
        }

        if (window.popinRecommend && window.popinRecommend.init) {
          console.log('執行 window.popinRecommend.init()')
          window.popinRecommend.init()
        }

        if (window.popin && window.popin.loadRecommend) {
          console.log('執行 window.popin.loadRecommend()')
          window.popin.loadRecommend('_popIn_recommend_word')
        }

        // 嘗試其他可能的初始化方法
        if (window.popin && typeof window.popin === 'function') {
          console.log('window.popin 是函數，直接調用')
          window.popin()
        }

        // 檢查 DOM 元素
        const popinElement = document.getElementById('_popIn_recommend_word')
        console.log('PopIn 元素:', popinElement)

        // 嘗試手動觸發事件
        if (popinElement) {
          console.log('手動觸發 PopIn 載入')
          const event = new Event('load')
          popinElement.dispatchEvent(event)

          // 嘗試其他觸發方式
          const clickEvent = new Event('click')
          popinElement.dispatchEvent(clickEvent)

          // 嘗試觸發 focus 事件
          const focusEvent = new Event('focus')
          popinElement.dispatchEvent(focusEvent)

          // 嘗試手動創建 PopIn 廣告
          console.log('嘗試手動創建 PopIn 廣告')
          try {
            // 創建 PopIn 推薦廣告的 iframe
            const iframe = document.createElement('iframe')
            iframe.src = 'https://api.popin.cc/recommend/mnews.html'
            iframe.style.width = '100%'
            iframe.style.height = '300px'
            iframe.style.border = 'none'
            iframe.style.overflow = 'hidden'

            // 清空原有內容並插入 iframe
            popinElement.innerHTML = ''
            popinElement.appendChild(iframe)

            console.log('手動創建 PopIn iframe 成功')
          } catch (error) {
            console.error('手動創建 PopIn 廣告失敗:', error)
          }
        }

        // 嘗試直接調用 PopIn 函數
        if (typeof window.popin === 'function') {
          console.log('直接調用 window.popin()')
          try {
            window.popin()
          } catch (error) {
            console.error('調用 window.popin() 失敗:', error)
          }
        }

        // 檢查是否有其他 PopIn 相關的全局變數
        console.log('檢查 PopIn 相關變數:')
        console.log('window.Popin:', window.Popin)
        console.log('window.PopinWidget:', window.PopinWidget)
        console.log('window.PopinRecommend:', window.PopinRecommend)
      }

      // 多次嘗試初始化
      setTimeout(initPopinAd, 500)
      setTimeout(initPopinAd, 1000)
      setTimeout(initPopinAd, 2000)
      setTimeout(initPopinAd, 5000)
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
            <div id="_popIn_recommend_word" ref={popinRef} />
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

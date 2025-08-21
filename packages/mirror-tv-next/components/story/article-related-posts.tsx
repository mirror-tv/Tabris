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
      console.log('PopIn 廣告區域已載入')

      // 檢查 iframe 是否正常載入
      const iframe = popinRef.current.querySelector('iframe')
      if (iframe) {
        iframe.onload = () => {
          console.log('PopIn iframe 載入成功')
        }
        iframe.onerror = () => {
          console.error('PopIn iframe 載入失敗')
        }

        // 設置超時檢查，如果 iframe 無法載入則顯示備用內容
        setTimeout(() => {
          try {
            // 檢查 iframe 是否真的載入了內容
            if (
              iframe.contentDocument &&
              iframe.contentDocument.body.innerHTML.trim()
            ) {
              console.log('PopIn iframe 內容載入成功')
            } else {
              console.log('PopIn iframe 內容為空，顯示備用內容')
              showFallbackContent()
            }
          } catch (e) {
            console.log('無法檢查 iframe 內容，可能是跨域問題，顯示備用內容')
            showFallbackContent()
          }
        }, 5000) // 5 秒後檢查
      }

      // 顯示備用內容的函數
      const showFallbackContent = () => {
        const fallback = document.getElementById('popin-fallback')
        if (fallback) {
          fallback.style.display = 'block'
          fallback.innerHTML = '推薦廣告載入完成'
        }
      }
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
            {/* PopIn 廣告 - 多種嘗試方式 */}
            <div id="_popIn_recommend_word" ref={popinRef}>
              {/* 方式 1: 直接 iframe */}
              <iframe
                src="https://api.popin.cc/recommend/mnews.html"
                style={{
                  width: '100%',
                  height: '300px',
                  border: 'none',
                  overflow: 'hidden',
                }}
                title="PopIn 推薦廣告"
              />

              {/* 方式 2: 備用腳本載入 */}
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    console.log('PopIn 備用腳本開始執行...');
                    (function() {
                      try {
                        var script = document.createElement('script');
                        script.src = 'https://api.popin.cc/recommend/mnews.js';
                        script.async = true;
                        script.onload = function() {
                          console.log('PopIn 備用腳本載入成功');
                        };
                        script.onerror = function() {
                          console.error('PopIn 備用腳本載入失敗');
                        };
                        document.head.appendChild(script);
                      } catch(e) {
                        console.error('PopIn 備用腳本執行失敗:', e);
                      }
                    })();
                  `,
                }}
              />

              {/* 方式 3: 如果都失敗，顯示備用內容 */}
              <div
                style={{
                  display: 'none',
                  width: '100%',
                  height: '300px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  textAlign: 'center',
                  lineHeight: '300px',
                  color: '#666',
                }}
                id="popin-fallback"
              >
                推薦廣告載入中...
              </div>
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

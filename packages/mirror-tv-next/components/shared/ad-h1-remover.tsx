'use client'
import { useEffect } from 'react'

/**
 * SEO 優化組件：動態移除第三方廣告中的 h1 和 h2 標籤
 * - Compass Fit: 移除 h1
 * - Popin: 移除 h1, h2
 * - Dable: 移除 h1 (iframe 外層)
 */
export default function AdH1Remover() {
  useEffect(() => {
    // 移除廣告中的 h1 和 h2 標籤
    const removeAdHeadingTags = () => {
      // Compass Fit 廣告
      const compassFitContainers = document.querySelectorAll(
        '[id^="compass-fit-"], .mic-ad, [class*="compass-fit"]'
      )

      compassFitContainers.forEach((container) => {
        const h1Elements = container.querySelectorAll('h1.compass-fit-heading')
        h1Elements.forEach((h1) => {
          h1.remove()
        })
      })

      // Popin 廣告
      const popinContainers = document.querySelectorAll(
        '.popin_recommend, #_popIn_recommend, [class*="popin"]'
      )

      popinContainers.forEach((container) => {
        // 移除 h1
        const h1Elements = container.querySelectorAll('h1')
        h1Elements.forEach((h1) => {
          h1.remove()
        })
      })

      // Dable 廣告（雖然是 iframe，但嘗試處理容器外的 h1）
      const dableContainers = document.querySelectorAll(
        '.dable-widget-last, .dable-widget, [class*="dable"]'
      )

      dableContainers.forEach((container) => {
        const h1Elements = container.querySelectorAll('h1')
        h1Elements.forEach((h1) => {
          // 直接移除 h1 標籤
          h1.remove()
        })
      })
    }

    removeAdHeadingTags()

    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element

              if (
                element.id?.startsWith('compass-fit-') ||
                element.classList.contains('mic-ad') ||
                element.classList.toString().includes('compass-fit') ||
                element.classList.toString().includes('popin') ||
                element.classList.toString().includes('dable') ||
                element.id.includes('compass-fit') ||
                element.id.includes('popin') ||
                element.id.includes('dable') ||
                element.querySelector('h1') ||
                element.querySelector('h2')
              ) {
                shouldCheck = true
              }
            }
          })
        }
      })

      if (shouldCheck) {
        setTimeout(removeAdHeadingTags, 100)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}

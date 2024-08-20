'use client'

import { useEffect } from 'react'

/**
 * 1.0 的版本使用 gtm 埋設廣告，但 2.0 寫在程式內
 * 為了讓 gtm 辨別「是否該顯示 gtm 內部的廣告」，可以使用 version 當作觸發條件
 */
const TagManagerWrapper = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      const tagManagerArgs = {
        event: 'gtm.load',
        page: {
          title: document.title,
          url: window.location.pathname,
          version: '2.0',
        },
      }
      window.dataLayer.push(tagManagerArgs)
    }
  }, [])
  return null
}

export default TagManagerWrapper

import { useEffect, useRef, RefObject } from 'react'

interface UseViewportIntersectionOptions {
  /**
   * 元素進入視口的閾值（0-1），預設為 0.85（85%）
   */
  threshold?: number
  /**
   * 需要連續停留的時間（毫秒），預設為 5000（5秒）
   */
  duration?: number
  /**
   * 當條件滿足時觸發的回調函數
   */
  onTrigger: () => void
}

/**
 * 檢測元素是否達到指定閾值進入視口，並在連續停留指定時間後觸發事件
 * 只會觸發一次，即使元素多次進出視口
 */
export default function useViewportIntersection(
  elementRef: RefObject<HTMLElement>,
  options: UseViewportIntersectionOptions
): void {
  const { threshold = 0.85, duration = 5000, onTrigger } = options
  const hasTriggeredRef = useRef(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const isInViewportRef = useRef(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element || hasTriggeredRef.current) {
      return
    }

    // 使用多個閾值點來更準確地檢測進入和離開 85% 的狀態
    // 這樣可以確保在達到 85% 時立即開始計時
    const thresholdArray = [
      0,
      threshold - 0.01, // 略低於閾值，用於檢測接近閾值
      threshold, // 目標閾值
      1, // 完全可見
    ]

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        const isIntersecting = entry.isIntersecting
        const intersectionRatio = entry.intersectionRatio

        // 檢查是否達到閾值（85%）
        const meetsThreshold = intersectionRatio >= threshold

        if (meetsThreshold && isIntersecting) {
          // 元素達到閾值且在視口內
          if (!isInViewportRef.current) {
            // 剛達到閾值，開始計時
            isInViewportRef.current = true
            timerRef.current = setTimeout(() => {
              // 再次檢查狀態，確保在計時期間仍然滿足條件
              if (!hasTriggeredRef.current && isInViewportRef.current) {
                hasTriggeredRef.current = true
                onTrigger()
              }
            }, duration)
          }
          // 如果已經在計時中，繼續保持計時狀態
        } else {
          // 元素未達到閾值或離開視口，重置計時
          if (isInViewportRef.current) {
            isInViewportRef.current = false
            if (timerRef.current) {
              clearTimeout(timerRef.current)
              timerRef.current = null
            }
          }
        }
      },
      {
        threshold: thresholdArray,
        rootMargin: '0px',
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [elementRef, threshold, duration, onTrigger])
}

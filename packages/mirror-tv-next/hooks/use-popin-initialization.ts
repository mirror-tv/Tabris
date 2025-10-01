'use client'
import { useEffect, useRef } from 'react'

interface UsePopinInitializationProps {
  elementId: string
  delay?: number
  maxRetries?: number
}

export const usePopinInitialization = ({
  elementId,
  delay = 1000,
  maxRetries = 10,
}: UsePopinInitializationProps) => {
  const retryCountRef = useRef(0)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (isInitializedRef.current) return

    const initPopIn = () => {
      const popinFunction = (window as unknown as { popin?: unknown }).popin
      const isPopinReady =
        typeof popinFunction === 'function' ||
        (typeof popinFunction === 'object' &&
          popinFunction &&
          'q' in popinFunction)

      if (isPopinReady) {
        try {
          console.log(`PopIn function found, initializing ${elementId}`)

          // 簡化的初始化邏輯
          if (typeof popinFunction === 'function') {
            popinFunction('loadRecommend', elementId)
          } else {
            ;(popinFunction as { q: unknown[] }).q.push([
              'loadRecommend',
              elementId,
            ])
          }

          console.log(`PopIn ${elementId} initialized successfully`)
          isInitializedRef.current = true
        } catch (error) {
          console.error(`PopIn initialization failed for ${elementId}:`, error)
          retryCountRef.current++
          if (retryCountRef.current < maxRetries) {
            setTimeout(initPopIn, 500)
          }
        }
      } else {
        retryCountRef.current++
        if (retryCountRef.current < maxRetries) {
          console.log(
            `PopIn not ready for ${elementId}, retrying in 500ms... (${retryCountRef.current}/${maxRetries})`
          )
          setTimeout(initPopIn, 500)
        } else {
          console.error(
            `PopIn initialization failed for ${elementId}: max retries exceeded`
          )
        }
      }
    }

    const timeoutId = setTimeout(initPopIn, delay)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [elementId, delay, maxRetries])

  return {
    isInitialized: isInitializedRef.current,
    retryCount: retryCountRef.current,
  }
}

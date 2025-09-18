'use client'
import { useEffect } from 'react'

type LazyRenderWrapperProps = {
  children: React.ReactNode
  callbackFn?: () => void
}

const LazyRenderWrapper = ({
  children,
  callbackFn,
}: LazyRenderWrapperProps) => {
  useEffect(() => {
    if (callbackFn) {
      callbackFn()
    }
  }, [])
  return <div>{children}</div>
}

export default LazyRenderWrapper

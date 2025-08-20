'use client'
import React, { useEffect, useRef } from 'react'

type LazyRendererProps = {
  id: string
  onLoad?: () => void
}

const LazyRenderer = ({ id, onLoad }: LazyRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      setTimeout(() => {
        onLoad?.()
      }, 100)
    }
  }, [onLoad])

  return <div ref={containerRef} id={id} />
}

export default LazyRenderer

'use client'

type LazyRenderWrapperProps = {
  children: React.ReactNode
}

const LazyRenderWrapper = ({ children }: LazyRenderWrapperProps) => {
  return <div>{children}</div>
}

export default LazyRenderWrapper

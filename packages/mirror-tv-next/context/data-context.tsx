'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { type PostCardItem } from '~/graphql/query/posts'
import type { HeaderData } from '~/types/header'
import type { RawPopularPost } from '~/types/popular-post'

type DataContextType = {
  popularPosts: RawPopularPost[]
  setPopularPosts: (posts: RawPopularPost[]) => void
  latestPosts: PostCardItem[]
  setLatestPosts: (posts: PostCardItem[]) => void
  headerData: HeaderData
  setHeaderData: (data: HeaderData) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({
  children,
  initialPopularPosts,
  initialLatestPosts,
  initialHeaderData,
}: {
  children: ReactNode
  initialPopularPosts: RawPopularPost[]
  initialLatestPosts: PostCardItem[]
  initialHeaderData: HeaderData
}) {
  const [popularPosts, setPopularPosts] =
    useState<RawPopularPost[]>(initialPopularPosts)
  const [latestPosts, setLatestPosts] = useState(initialLatestPosts)
  const [headerData, setHeaderData] = useState<HeaderData>(initialHeaderData)

  return (
    <DataContext.Provider
      value={{
        popularPosts,
        setPopularPosts,
        latestPosts,
        setLatestPosts,
        headerData,
        setHeaderData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

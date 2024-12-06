'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import type { HeaderData } from '~/types/header'
import type { RawPopularPost } from '~/types/popular-post'

type DataContextType = {
  popularPosts: RawPopularPost[]
  setPopularPosts: (posts: RawPopularPost[]) => void
  headerData: HeaderData
  setHeaderData: (data: HeaderData) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({
  children,
  initialPopularPosts,
  initialHeaderData,
}: {
  children: ReactNode
  initialPopularPosts: RawPopularPost[]
  initialHeaderData: HeaderData
}) {
  const [popularPosts, setPopularPosts] =
    useState<RawPopularPost[]>(initialPopularPosts)
  const [headerData, setHeaderData] = useState<HeaderData>(initialHeaderData)

  return (
    <DataContext.Provider
      value={{
        popularPosts,
        setPopularPosts,
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

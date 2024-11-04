'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import type { RawPopularPost } from '~/types/popular-post'

type DataContextType = {
  popularPosts: RawPopularPost[]
  setPopularPosts: (posts: RawPopularPost[]) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({
  children,
  initialPopularPosts,
}: {
  children: ReactNode
  initialPopularPosts: RawPopularPost[]
}) {
  const [popularPosts, setPopularPosts] =
    useState<RawPopularPost[]>(initialPopularPosts)

  return (
    <DataContext.Provider value={{ popularPosts, setPopularPosts }}>
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

'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import type { HeaderData } from '~/types/header'
import { fetchHeaderJson } from './action'

interface AppContextType {
  data: HeaderData
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [headerData, setHeaderData] = useState<HeaderData>({
    allSponsors: [],
    allCategories: [],
    allShows: [],
  })
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetchHeaderJson()
        setHeaderData(data)
      } catch (error) {
        console.error('Error fetching header json data:', error)
      }
    }

    fetchData()
  }, [])
  return (
    <AppContext.Provider value={{ data: headerData }}>
      {children}
    </AppContext.Provider>
  )
}

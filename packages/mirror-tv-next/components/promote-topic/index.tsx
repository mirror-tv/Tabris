'use client'

import { useEffect, useState } from 'react'
import type { PromoteTopicData } from '~/types/promote-topic'
import { fetchPromoteTopics } from './fetch-promote-topics'
import PromoteTopicSwiper from './swiper'

export default function PromoteTopic() {
  const [list, setList] = useState<PromoteTopicData[]>([])

  useEffect(() => {
    const loadPromoteTopics = async () => {
      const data = await fetchPromoteTopics()
      setList(data)
    }
    loadPromoteTopics()
  }, [])

  if (!list.length) return null

  return <PromoteTopicSwiper list={list} />
}

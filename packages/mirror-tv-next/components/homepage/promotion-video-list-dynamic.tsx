'use client'
import dynamic from 'next/dynamic'

const PromotionVideoList = dynamic(() => import('./promotion-video-list'))

export default PromotionVideoList

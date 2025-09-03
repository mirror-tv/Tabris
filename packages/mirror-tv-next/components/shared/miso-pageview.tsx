'use client'
import { MISO_API_KEY } from '../../constants/config'
import { useEffect } from 'react'

export default function MisoPageView({ productIds }: { productIds: string }) {
  useEffect(() => {
    const misocmd = window.misocmd || (window.misocmd = [])
    misocmd.push(() => {
      const MisoClient = window.MisoClient
      const client = new MisoClient(MISO_API_KEY)
      client.api.interactions.upload({
        type: 'product_detail_page_view',
        product_ids: [`mirrortv_${productIds}`],
      })
    })
  }, [])

  return <></>
}

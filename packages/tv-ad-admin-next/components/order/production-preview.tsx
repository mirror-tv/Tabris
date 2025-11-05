import Image from 'next/image'

import { OrderRecordForOrderNumber } from '@/graphql/queries/orders'
type ProductionPreviewProps = {
  className?: string
  order: OrderRecordForOrderNumber
}

export function ProductionPreview({
  className = '',
  order,
}: ProductionPreviewProps) {
  return (
    <div className={className}>
      <h5 className="mb-4 text-text-primary">製作成品預覽</h5>
      <div>
        <h6 className="font-sans text-sm leading-normal font-medium text-text-secondary">
          影片截圖
        </h6>
        <div className="relative my-2 aspect-video w-full overflow-hidden rounded-lg bg-gray-2">
          {order.demoImage?.[0]?.url ? (
            <Image
              src={order.demoImage[0].url}
              alt="video-preview"
              fill
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-text-tertiary">
              影片預覽圖還未上傳
            </div>
          )}
        </div>
        <div className="flex justify-between font-sans text-sm leading-normal font-normal text-text-secondary">
          <div>
            <span>影片長度：</span>
            <span>10秒</span>
          </div>
          <div>
            <span>尺寸：</span>
            <span>
              {order.demoImage?.[0]?.imageFile?.width || '???'}x
              {order.demoImage?.[0]?.imageFile?.height || '???'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

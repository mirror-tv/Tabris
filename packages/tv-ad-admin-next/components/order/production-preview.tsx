import { useMemo } from 'react'

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
  const demoImages = useMemo(
    () =>
      Array.isArray(order.demoImage)
        ? order.demoImage
        : order.demoImage
          ? [order.demoImage]
          : null,
    [order.demoImage]
  )
  return (
    <div className={className}>
      <h5 className="mb-4 text-text-primary">製作成品預覽</h5>
      <div>
        <h6 className="font-sans text-sm leading-normal font-medium text-text-secondary">
          影片截圖
        </h6>
        <div className="flex flex-col gap-1">
          {demoImages?.[0]?.url ? (
            demoImages.map((image) => (
              <div
                className="relative my-2 aspect-video w-full overflow-hidden rounded-lg bg-gray-1"
                key={image.id}
              >
                <Image
                  src={image.url || ''}
                  alt="video-preview"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            ))
          ) : (
            <div className="relative my-2 flex aspect-video w-full flex-col gap-2 overflow-hidden rounded-lg bg-gray-1">
              <div className="flex h-full w-full items-center justify-center text-text-tertiary">
                影片預覽圖還未上傳
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between font-sans text-sm leading-normal font-normal text-text-secondary">
          <div>
            <span>影片長度：</span>
            <span>{order.videoDuration}秒</span>
          </div>
          <div>
            <span>尺寸：</span>
            <span>
              {demoImages?.[0]?.imageFile?.width || '???'}x
              {demoImages?.[0]?.imageFile?.height || '???'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

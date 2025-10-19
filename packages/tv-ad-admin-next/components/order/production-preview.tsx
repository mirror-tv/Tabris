type ProductionPreviewProps = {
  className?: string
}

export function ProductionPreview({ className = '' }: ProductionPreviewProps) {
  return (
    <div className={className}>
      <h5 className="mb-4 text-text-primary">製作成品預覽</h5>
      <div>
        <h6 className="font-sans text-sm leading-normal font-medium text-text-secondary">
          影片截圖
        </h6>
        <div className="my-2 aspect-video w-full overflow-hidden rounded-lg bg-gray-2">
          <div className="flex h-full w-full items-center justify-center text-text-tertiary">
            影片截圖預覽
          </div>
        </div>
        <div className="flex justify-between font-sans text-sm leading-normal font-normal text-text-secondary">
          <div>
            <span>影片長度：</span>
            <span>10秒</span>
          </div>
          <div>
            <span>尺寸：</span>
            <span>1920x1080</span>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Button } from '@/components/ui/button'
import DetailIcon from '@/public/icons/detail.svg'
import DocumentIcon from '@/public/icons/document.svg'

type RelatedDocumentsProps = {
  className?: string
}

export function RelatedDocuments({ className = '' }: RelatedDocumentsProps) {
  return (
    <div className={`${className}`}>
      <h5 className="mb-3 text-text-secondary">相關文件</h5>
      <div className="space-y-3">
        <div className="flex items-center justify-between self-stretch rounded-[12px] border border-gray-3 bg-white p-[12px]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-[8px] bg-[#EFF6FF] text-xs font-medium text-white">
              <DocumentIcon />
            </div>
            <div>
              <p className="font-sans text-base leading-normal font-medium text-text-primary">
                廣告素材規格書.pdf
              </p>
              <p className="typography-caption2 text-text-tertiary">
                236 KB • PDF文件
              </p>
            </div>
          </div>
          <Button
            onClick={() => window.open('https://www.google.com', '_blank')}
            variant="outline"
            intent="secondary"
            className="gap-1"
          >
            <DetailIcon className="h-4 w-4" />
            查看
          </Button>
        </div>
      </div>
    </div>
  )
}

import { Button } from '@/components/ui/button'
import { type OrderRecordForOrderNumber } from '@/graphql/queries/orders'
import DetailIcon from '@/public/icons/detail.svg'
import DocumentIcon from '@/public/icons/document.svg'

type RelatedDocumentsProps = {
  className?: string
  attachment?: OrderRecordForOrderNumber['attachment']
}

export function RelatedDocuments({
  className = '',
  attachment,
}: RelatedDocumentsProps) {
  if (!attachment) return null

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
                {attachment.name ||
                  attachment.file?.filename ||
                  '檔案文件規格書.pdf'}
              </p>
              <p className="typography-caption2 text-text-tertiary">
                {attachment.file?.filesize
                  ? `${(attachment.file?.filesize / 1024).toFixed(0)} KB`
                  : '???'}{' '}
                • PDF文件
              </p>
            </div>
          </div>
          <Button
            onClick={() => window.open(attachment.url || '', '_blank')}
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

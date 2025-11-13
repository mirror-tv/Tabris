'use client'

import { ReactNode, useState } from 'react'

import { Instructions } from '@/components/shared/instructions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import TriangleExclamationIcon from '@/public/icons/triangle-exclamation.svg'

export type PreviewData = {
  orderNumber: string
  adName: string
  adText1: string
  adText2?: string
  adRange: {
    from: string
    to: string
  }
  adImageName: string
  isUrgent?: boolean
}

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  previewData: PreviewData
  onConfirm: () => void
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  previewData,
  onConfirm,
}: ConfirmDialogProps) {
  const [isUploading, setIsUploading] = useState(false)

  const { orderNumber, adName, adRange, adText1, adText2, adImageName, isUrgent } =
    previewData

  async function handleConfirm() {
    try {
      setIsUploading(true)
      await onConfirm()
      onOpenChange(false)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-3">
        <DialogHeader className="gap-0">
          <DialogTitle asChild>
            <h5 className="typography-h5">再次確認資訊</h5>
          </DialogTitle>
          <DialogDescription className="typography-caption1 text-gray-6">
            請確認您即將上傳的素材內容：
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1 rounded-lg bg-gray-2 p-3">
          <InfoRow label="訂單編號：">{orderNumber}</InfoRow>
          {isUrgent !== undefined && (
            <InfoRow label="這是急件訂單：">{isUrgent ? '是' : '否'}</InfoRow>
          )}
          <InfoRow label="廣告名稱：">{adName}</InfoRow>
          <InfoRow label="排播日期：">
            {`${adRange.from} - ${adRange.to}`}
          </InfoRow>
          <InfoRow label="文字素材一：">{adText1}</InfoRow>
          {adText2 && <InfoRow label="文字素材二：">{adText2}</InfoRow>}
          <InfoRow label="上傳檔案：">{adImageName}</InfoRow>
        </div>

        <Instructions
          title="重要提醒"
          icon={<TriangleExclamationIcon />}
          wordings={[
            '素材送出後將無法編輯、修改，請確認所有上傳內容正確無誤。',
          ]}
        />

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button intent="secondary" size="lg">
              取消
            </Button>
          </DialogClose>
          <Button size="lg" onClick={handleConfirm} disabled={isUploading}>
            {isUploading ? '上傳中…' : '確認上傳'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p className="font-medium text-gray-8">
      <span className="font-medium text-gray-6">{label}</span>
      {children}
    </p>
  )
}

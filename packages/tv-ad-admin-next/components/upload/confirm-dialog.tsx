'use client'

import { ReactNode } from 'react'

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

export type UploadSubmittedData = {
  order: string
  adName: string
  text1: string
  text2?: string
  fileName: string
  range: {
    from: string
    to: string
  }
}

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  submittedData: UploadSubmittedData | null
   onConfirm: () => void
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  submittedData,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-3">
        <DialogHeader className="gap-0">
          <DialogTitle asChild>
            <h5 className="typography-h5">再次確認資訊</h5>
          </DialogTitle>
          <DialogDescription className="typography-caption1 text-gray-6">
            以下是您上傳的素材資料，請再次確認：
          </DialogDescription>
        </DialogHeader>

        {submittedData && (
          <div className="space-y-1 rounded-lg bg-gray-2 p-3">
            <InfoRow label="訂單編號：">{submittedData.order}</InfoRow>
            <InfoRow label="廣告名稱：">{submittedData.adName}</InfoRow>
            <InfoRow label="排播日期：">
              {`${submittedData.range.from} - ${submittedData.range.to}`}
            </InfoRow>
            <InfoRow label="文字素材一：">{submittedData.text1}</InfoRow>
            {submittedData.text2 && (
              <InfoRow label="文字素材二：">{submittedData.text2}</InfoRow>
            )}
            <InfoRow label="上傳檔案：">{submittedData.fileName}</InfoRow>
          </div>
        )}
        <Instructions
          title="重要提醒"
          icon={<TriangleExclamationIcon />}
          wordings={['素材送出後將無法編輯、修改，請確認所有上傳內容正確無誤']}
        />

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button intent="secondary" size="lg">
              取消
            </Button>
          </DialogClose>
          <Button size="lg" onClick={() => {
            onConfirm()
            onOpenChange(false)}}>
            確認上傳
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


function InfoRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <p className="font-medium text-gray-8">
      <span className="font-medium text-gray-6">{label}</span>
      {children}
    </p>
  )
}
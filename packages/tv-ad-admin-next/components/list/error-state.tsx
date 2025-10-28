'use client'

import { Button } from '@/components/ui/button'

export function ErrorState() {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-4 text-center">
        <p className="text-lg font-medium text-text-primary">網路連線異常</p>
        <p className="mt-2 text-sm text-text-secondary">
          無法載入訂單資料，請檢查網路連線後重試
        </p>
      </div>
      <Button onClick={handleRefresh} variant="fill">
        重新整理
      </Button>
    </div>
  )
}

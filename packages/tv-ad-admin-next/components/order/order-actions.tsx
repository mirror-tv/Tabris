import { useState, useMemo } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import LoadingSpinner from '@/components/shared/loading-spinner'
import { Button } from '@/components/ui/button'
import { ORDER_STATE } from '@/constants'
import { type OrderRecordForOrderNumber } from '@/graphql/queries/orders'
import DoneCircleIcon from '@/public/icons/done-circle.svg'
import EditIcon from '@/public/icons/edit.svg'
import UploadIcon from '@/public/icons/upload.svg'

type OrderActionsProps = {
  order: OrderRecordForOrderNumber
  className?: string
}

const styles = {
  container: 'rounded-lg border border-gray-3 bg-white p-6',
  title: 'typography-h4 mb-4 font-semibold text-text-primary',
  buttonContainer: 'space-y-3 space-x-2',
  primaryButton: 'bg-blue-6 text-white hover:bg-blue-7',
  secondaryButton: 'border-gray-3 text-text-secondary hover:bg-gray-1',
  statusMessage:
    'font-sans text-sm leading-normal font-normal text-text-secondary',
  helpContainer:
    'flex w-full items-start self-stretch rounded-[10px] border border-[var(--color-border-default)] border-gray-3 bg-[var(--color-surface-tertiary)] p-[13px] font-sans text-sm font-medium text-text-secondary',
  helpText: 'min-w-fit',
  helpLink:
    'typography-caption1 font-medium text-text-secondary underline hover:text-text-primary',
}

type ActionConfig = {
  buttonText: string | null
  buttonIcon: React.ReactElement | null
  buttonClassName: string
  helpText: string
  helpLinkText: string
  statusMessage: string | null
  secondaryButton?: {
    text: string
    icon: React.ReactElement
    className: string
  }
}

const ACTION_MAP: Record<string, ActionConfig> = {
  [ORDER_STATE.PENDING_UPLOAD]: {
    buttonText: '上傳素材',
    buttonIcon: <UploadIcon />,
    buttonClassName: 'bg-blue-6 text-white hover:bg-blue-7',
    helpText: '需要協助？',
    helpLinkText: '申請退款',
    statusMessage: null,
  },
  [ORDER_STATE.MATERIAL_UPLOADED]: {
    buttonText: null,
    buttonIcon: null,
    buttonClassName: '',
    helpText: '需要協助？',
    helpLinkText: '申請退款',
    statusMessage: '請等待業務確認素材，如沒問題便會繼續製作影片。',
  },
  [ORDER_STATE.VIDEO_PRODUCTION]: {
    buttonText: null,
    buttonIcon: null,
    buttonClassName: '',
    helpText: '需要協助？',
    helpLinkText: '申請退款',
    statusMessage: '請等待業務確認素材，如沒問題便會繼續製作影片。',
  },
  [ORDER_STATE.PENDING_SCHEDULE]: {
    buttonText: null,
    buttonIcon: null,
    buttonClassName: '',
    helpText: '需要協助？',
    helpLinkText: '申請退款',
    statusMessage: '排播時間已設定，正在等待廣告播出。',
  },
  [ORDER_STATE.BROADCASTED]: {
    buttonText: null,
    buttonIcon: null,
    buttonClassName: '',
    helpText: '需要協助？',
    helpLinkText: '申請退款',
    statusMessage: '廣告已成功播出。',
  },
  [ORDER_STATE.PENDING_BROADCAST_DATE]: {
    buttonText: '設定排播日期',
    buttonIcon: <EditIcon />,
    buttonClassName: styles.primaryButton,
    helpText: '需要協助？',
    helpLinkText: '申請退款',
    statusMessage: null,
  },
  [ORDER_STATE.PENDING_CONFIRMATION]: {
    buttonText: '確認',
    buttonIcon: <DoneCircleIcon />,
    buttonClassName: styles.primaryButton,
    helpText: '需要協助？',
    helpLinkText: '申請退款',
    statusMessage: null,
    secondaryButton: {
      text: '提出修改',
      icon: <EditIcon />,
      className: styles.secondaryButton,
    },
  },
  [ORDER_STATE.CANCELLED]: {
    buttonText: null,
    buttonIcon: null,
    buttonClassName: '',
    helpText: '需要協助？',
    helpLinkText: '申請退款',
    statusMessage: '本訂單已作廢。',
  },
  [ORDER_STATE.TRANSFERRED]: {
    buttonText: null,
    buttonIcon: null,
    buttonClassName: '',
    helpText: '需要協助？',
    helpLinkText: '申請退款',
    statusMessage: '此訂單已轉移至新訂單，請到新訂單進行操作。',
  },
  [ORDER_STATE.PENDING_QUOTE_CONFIRMATION]: {
    buttonText: null,
    buttonIcon: null,
    buttonClassName: '',
    helpText: '需要協助？',
    helpLinkText: '申請退款',
    statusMessage: '請至信箱確認修改報價並完成付款，以繼續製作廣告。',
  },
  [ORDER_STATE.MODIFICATION_REQUEST]: {
    buttonText: null,
    buttonIcon: null,
    buttonClassName: '',
    helpText: '需要協助？',
    helpLinkText: '申請退款',
    statusMessage: '修改要求已提出，等待業務回應。',
  },
}

export function OrderActions({ order, className = '' }: OrderActionsProps) {
  const [isUploading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const router = useRouter()
  const handleUploadClick = async () => {
    router.push(`/order/re-upload/${order.orderNumber}`)
  }

  const handleConfirmClick = async () => {
    if (isConfirming) return

    setIsConfirming(true)

    try {
      const response = await fetch(`/api/order/${order.orderNumber}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || '確認失敗')
      }
      window.location.reload()
    } catch (error) {
      console.error('確認失敗:', error)
      alert(
        error instanceof Error
          ? `確認失敗: ${error.message}`
          : '確認失敗，請稍後再試'
      )
    } finally {
      setIsConfirming(false)
    }
  }

  const handleSettingScheduleClick = () => {
    router.push(`/order/${order.orderNumber}/schedule`)
  }

  const handleModifyClick = () => {
    router.push(`/edit-request/${order.orderNumber}`)
  }

  const actionContent = useMemo(() => {
    return ACTION_MAP[order.state] ?? ACTION_MAP[ORDER_STATE.PENDING_UPLOAD]
  }, [order.state])

  return (
    <section className={`${styles.container} ${className} relative`}>
      {isConfirming && <LoadingSpinner message="確認中..." overlay />}
      <h5 className={styles.title}>訂單操作</h5>
      <div className={styles.buttonContainer}>
        {actionContent.buttonText && (
          <Button
            onClick={
              actionContent.buttonText === '上傳素材'
                ? handleUploadClick
                : actionContent.buttonText === '確認'
                  ? handleConfirmClick
                  : actionContent.buttonText === '設定排播日期'
                    ? handleSettingScheduleClick
                    : undefined
            }
            disabled={isUploading || isConfirming}
          >
            {actionContent.buttonIcon}
            {isUploading && actionContent.buttonText === '上傳素材'
              ? '上傳中...'
              : isConfirming && actionContent.buttonText === '確認'
                ? '確認中...'
                : actionContent.buttonText}
          </Button>
        )}
        {actionContent.secondaryButton && (
          <Button
            variant="outline"
            onClick={
              actionContent.secondaryButton.text === '提出修改'
                ? handleModifyClick
                : undefined
            }
            disabled={false}
          >
            {actionContent.secondaryButton.icon}
            {actionContent.secondaryButton.text}
          </Button>
        )}
        {actionContent.statusMessage && (
          <p className={styles.statusMessage}>{actionContent.statusMessage}</p>
        )}
        <div className={styles.helpContainer}>
          <h6 className={styles.helpText}>{actionContent.helpText}</h6>
          {actionContent.helpLinkText && (
            <Link
              className={styles.helpLink}
              href="#"
              target="_blank"
              rel="noreferrer"
            >
              {actionContent.helpLinkText}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

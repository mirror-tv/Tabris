import DoneIcon from '@/assets/icons/done.svg'
import {
  OrderStatusMap,
  PROGRESS_COLOR_RULES,
  getStatusesByRoute,
  getCurrentRoute,
  ORDER_STATUS,
  type OrderStatus,
} from '@/constants'

type ProgressStepsProps = {
  currentStatus: OrderStatus
  className?: string
}

export function ProgressSteps({
  currentStatus,
  className = '',
}: ProgressStepsProps) {
  // 對於已作廢狀態，只顯示該狀態本身
  if (currentStatus === ORDER_STATUS.CANCELLED) {
    const progressSteps = [currentStatus]

    return (
      <div className={className}>
        <h6 className="mb-3 text-sm font-medium text-text-secondary">
          處理進度
        </h6>
        <div className="space-y-2">
          {progressSteps.map((status) => {
            const statusConfig = OrderStatusMap[status]
            const completedStyle = PROGRESS_COLOR_RULES.getCompletedStyle()

            return (
              <div key={status} className="flex items-center gap-3">
                <div
                  className={`flex size-3 items-center justify-center rounded-full ${completedStyle.bgColor}`}
                >
                  <DoneIcon />
                </div>
                <span
                  className={`text-sm font-medium ${completedStyle.textColor}`}
                >
                  {statusConfig.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const currentRoute = getCurrentRoute(currentStatus)
  const progressSteps = getStatusesByRoute(currentRoute)

  const getStepStatus = (step: OrderStatus, index: number) => {
    const isActive = currentStatus === step
    const completedStyle = PROGRESS_COLOR_RULES.getCompletedStyle()
    const currentIndex = progressSteps.indexOf(currentStatus)

    const isTransferredRoute = currentRoute === 'transferred'
    const isCompleted = isTransferredRoute ? true : index < currentIndex

    return {
      isCompleted: isCompleted,
      isActive: isActive && !isTransferredRoute,
      style: completedStyle,
    }
  }

  return (
    <div className={className}>
      <h6 className="mb-3 text-sm font-medium text-text-secondary">處理進度</h6>
      <div className="space-y-2">
        {progressSteps.map((status, index) => {
          const statusConfig = OrderStatusMap[status]
          const stepStatus = getStepStatus(status, index)

          return (
            <div key={status} className="flex items-center gap-3">
              <div
                className={`flex size-3 items-center justify-center rounded-full ${
                  stepStatus.isCompleted
                    ? stepStatus.style.bgColor
                    : stepStatus.isActive
                    ? PROGRESS_COLOR_RULES.getActiveColor(status, 'bg')
                    : 'bg-gray-4'
                }`}
              >
                {stepStatus.isCompleted && <DoneIcon />}
              </div>
              <span
                className={`text-sm font-medium ${
                  stepStatus.isCompleted
                    ? stepStatus.style.textColor
                    : stepStatus.isActive
                    ? PROGRESS_COLOR_RULES.getActiveColor(status, 'text')
                    : 'text-text-tertiary'
                }`}
              >
                {statusConfig.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

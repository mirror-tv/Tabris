import {
  OrderStateMap,
  PROGRESS_COLOR_RULES,
  getStatesByFlow,
  getCurrentFlow,
  ORDER_STATE,
  type OrderState,
} from '@/constants'
import DoneIcon from '@/public/icons/done.svg'

type ProgressStepsProps = {
  currentStatus: OrderState
  className?: string
}

export function ProgressSteps({
  currentStatus,
  className = '',
}: ProgressStepsProps) {
  if (currentStatus === ORDER_STATE.CANCELLED) {
    const progressSteps = [currentStatus]

    return (
      <div className={className}>
        <h6 className="mb-3 text-sm font-medium text-text-secondary">
          處理進度
        </h6>
        <div className="space-y-2">
          {progressSteps.map((status) => {
            const statusConfig = OrderStateMap[status]
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

  const currentFlow = getCurrentFlow(currentStatus)
  const progressSteps = getStatesByFlow(currentFlow)

  const getStepStatus = (step: OrderState, index: number) => {
    const isActive = currentStatus === step
    const completedStyle = PROGRESS_COLOR_RULES.getCompletedStyle()
    const currentIndex = progressSteps.indexOf(currentStatus)

    // 當訂單狀態為 TRANSFERRED 時，所有步驟都顯示為已完成
    const isTransferred = currentStatus === ORDER_STATE.TRANSFERRED
    const isCompleted = isTransferred ? true : index < currentIndex

    return {
      isCompleted: isCompleted,
      isActive: isActive && !isTransferred,
      style: completedStyle,
    }
  }

  return (
    <div className={className}>
      <h6 className="mb-3 text-sm font-medium text-text-secondary">處理進度</h6>
      <div className="space-y-2">
        {progressSteps.map((status, index) => {
          const statusConfig = OrderStateMap[status]
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

import { COLOR_THEMES } from './colors'

export type StateFlow = 'normal' | 'cancel' | 'setTime' | 'edit'

export const ORDER_STATE = {
  PENDING_UPLOAD: 'paid',
  MATERIAL_UPLOADED: 'file_uploaded',
  VIDEO_PRODUCTION: 'video_wip',
  PENDING_CONFIRMATION: 'to_be_confirmed',
  PENDING_SCHEDULE: 'scheduled',
  BROADCASTED: 'broadcasted',
  MODIFICATION_REQUEST: 'modification_request',
  PENDING_QUOTE_CONFIRMATION: 'pending_quote_confirmation',
  TRANSFERRED: 'transferred',
  PENDING_BROADCAST_DATE: 'pending_broadcast_date',
  DATE_RESET: 'date_reset',
  CANCELLED: 'cancelled',
} as const

export const OrderStateMap = {
  [ORDER_STATE.PENDING_UPLOAD]: {
    label: '待上傳素材',
    colors: COLOR_THEMES.label.gray,
    progressColor: 'red',
  },
  [ORDER_STATE.MATERIAL_UPLOADED]: {
    label: '素材已上傳',
    colors: COLOR_THEMES.label.yellow,
    progressColor: 'yellow',
  },
  [ORDER_STATE.VIDEO_PRODUCTION]: {
    label: '影片製作中',
    colors: COLOR_THEMES.label.yellow,
    progressColor: 'yellow',
  },
  [ORDER_STATE.PENDING_CONFIRMATION]: {
    label: '待確認',
    colors: COLOR_THEMES.label.red,
    progressColor: 'red',
  },
  [ORDER_STATE.PENDING_SCHEDULE]: {
    label: '待排播',
    colors: COLOR_THEMES.label.blue,
    progressColor: 'blue',
  },
  [ORDER_STATE.BROADCASTED]: {
    label: '已播出',
    colors: COLOR_THEMES.label.green,
    progressColor: 'green',
  },
  [ORDER_STATE.MODIFICATION_REQUEST]: {
    label: '提出修改要求',
    colors: COLOR_THEMES.label.yellow,
    progressColor: 'orange',
  },
  [ORDER_STATE.PENDING_QUOTE_CONFIRMATION]: {
    label: '待加購修改',
    colors: COLOR_THEMES.label.red,
    progressColor: 'red',
  },
  [ORDER_STATE.TRANSFERRED]: {
    label: '已轉移至新訂單',
    colors: COLOR_THEMES.label.dark,
    progressColor: 'green',
  },
  [ORDER_STATE.PENDING_BROADCAST_DATE]: {
    label: '待設定排播日期',
    colors: COLOR_THEMES.label.red,
    progressColor: 'red',
  },
  [ORDER_STATE.DATE_RESET]: {
    label: '已重新設定排播日期',
    colors: COLOR_THEMES.label.yellow,
    progressColor: 'yellow',
  },
  [ORDER_STATE.CANCELLED]: {
    label: '已作廢',
    colors: COLOR_THEMES.label.dark,
    progressColor: 'green',
  },
} as const

export type OrderState = keyof typeof OrderStateMap

const basicFlow = [
  ORDER_STATE.PENDING_UPLOAD,
  ORDER_STATE.MATERIAL_UPLOADED,
  ORDER_STATE.VIDEO_PRODUCTION,
  ORDER_STATE.PENDING_CONFIRMATION,
]

// 根據流程獲取狀態列表（按業務邏輯順序）
export const getStatesByFlow = (flow: StateFlow): OrderState[] => {
  const flowOrderMap: Record<StateFlow, OrderState[]> = {
    normal: [
      ...basicFlow,
      ORDER_STATE.PENDING_SCHEDULE,
      ORDER_STATE.BROADCASTED,
    ],
    edit: [
      ...basicFlow,
      ORDER_STATE.MODIFICATION_REQUEST,
      ORDER_STATE.PENDING_QUOTE_CONFIRMATION,
      ORDER_STATE.TRANSFERRED,
    ],
    setTime: [
      ...basicFlow.slice(0, 3),
      ORDER_STATE.PENDING_BROADCAST_DATE,
      ORDER_STATE.DATE_RESET,
      ORDER_STATE.PENDING_CONFIRMATION,
      ORDER_STATE.PENDING_SCHEDULE,
      ORDER_STATE.BROADCASTED,
    ],
    cancel: [ORDER_STATE.CANCELLED],
  }

  return flowOrderMap[flow] || []
}

const NORMAL_FLOW_STATES = new Set<OrderState>([
  ...basicFlow,
  ORDER_STATE.PENDING_SCHEDULE,
  ORDER_STATE.BROADCASTED,
])

const EDIT_FLOW_STATES = new Set<OrderState>([
  ORDER_STATE.MODIFICATION_REQUEST,
  ORDER_STATE.PENDING_QUOTE_CONFIRMATION,
  ORDER_STATE.TRANSFERRED,
])

const SET_TIME_FLOW_STATES = new Set<OrderState>([
  ORDER_STATE.PENDING_BROADCAST_DATE,
  ORDER_STATE.DATE_RESET,
])

/**
 * 根據當前訂單狀態判斷所屬的流程類型
 * @param state 當前訂單狀態
 * @returns 對應的流程類型
 */
export const getCurrentFlow = (state: OrderState): StateFlow => {
  if (NORMAL_FLOW_STATES.has(state)) {
    return 'normal'
  }
  if (EDIT_FLOW_STATES.has(state)) {
    return 'edit'
  }
  if (SET_TIME_FLOW_STATES.has(state)) {
    return 'setTime'
  }
  return 'cancel'
}

/**
 * 根據當前狀態獲取下一個狀態（根據 flow）
 * @param currentState 當前狀態
 * @returns 下一個狀態，如果已經是最後一個狀態或找不到則返回 null
 */
export const getNextState = (
  currentState: OrderState,
  flow?: StateFlow
): OrderState | null => {
  const searchedflow = flow ? flow : getCurrentFlow(currentState)
  const states = getStatesByFlow(searchedflow)
  const currentIndex = states.indexOf(currentState)

  if (currentIndex === -1 || currentIndex === states.length - 1) {
    return null
  }

  return states[currentIndex + 1]
}

export const PROGRESS_COLOR_RULES = {
  getActiveColor: (state: OrderState, type: 'text' | 'bg' = 'text'): string => {
    const stateConfig = OrderStateMap[state]
    const colorKey = stateConfig.progressColor

    const theme =
      COLOR_THEMES.progress[colorKey as keyof typeof COLOR_THEMES.progress]
    if (!theme) {
      return type === 'text' ? 'text-text-secondary' : 'bg-gray-4'
    }

    return theme[type]
  },

  getCompletedStyle: () => ({
    textColor: 'text-text-primary',
    bgColor: 'bg-gray-9',
  }),
}

export const ORDER_STATE_CONFIG = {
  PREVIEW_REQUIRED_STATUSES: [
    ORDER_STATE.PENDING_CONFIRMATION,
    ORDER_STATE.PENDING_SCHEDULE,
    ORDER_STATE.BROADCASTED,
    ORDER_STATE.MODIFICATION_REQUEST,
    ORDER_STATE.PENDING_BROADCAST_DATE,
  ] as const,
}

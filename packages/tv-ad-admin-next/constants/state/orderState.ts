import { COLOR_THEMES } from './colors'

export type StateRoute =
  | 'normal'
  | 'cancel'
  | 'setTime'
  | 'edit'
  | 'transferred'

// TODO: 跟後端的有些值對不上，可能還少一兩個 key
// const orderStateOptions = [
//   { label: '待上傳素材', value: 'paid' },
//   { label: '已上傳檔案', value: 'file_uploaded' },
//   { label: '已確認素材', value: 'material_confirmed' },
//   { label: '素材更新', value: 'material_updated' },
//   { label: '已製作', value: 'produced' },
//   { label: '影片確認', value: 'video_confirmed' },
//   { label: '排播', value: 'scheduled' },
//   { label: '已播出', value: 'broadcasted' },
//   { label: '提出修改要求', value: 'modification_request' }, 待修正
//   { label: '待確認修改報價', value: 'pending_quote_confirmation' }, 已修正
//   { label: '已轉交', value: 'transferred' },
//   { label: '待排播', value: 'pending_broadcast_date' },
//   { label: '已取消', value: 'cancelled' },
// ]
export const ORDER_STATE = {
  PENDING_UPLOAD: 'paid',
  MATERIAL_UPLOADED: 'file_uploaded',
  VIDEO_PRODUCTION: 'material_confirmed',
  PENDING_CONFIRMATION: 'material_updated',
  PENDING_SCHEDULE: 'produced',
  BROADCASTED: 'video_confirmed',
  MODIFICATION_REQUEST: 'scheduled',
  PENDING_QUOTE_CONFIRMATION: 'pending_quote_confirmation',
  TRANSFERRED: 'transferred',
  PENDING_BROADCAST_DATE: 'pending_broadcast_date',
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
    progressColor: 'green',
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
    label: '待確認修改報價',
    colors: COLOR_THEMES.label.red,
    progressColor: 'red',
  },
  [ORDER_STATE.TRANSFERRED]: {
    label: '已轉移',
    colors: COLOR_THEMES.label.dark,
    progressColor: 'green',
  },
  [ORDER_STATE.PENDING_BROADCAST_DATE]: {
    label: '待設定排播日期',
    colors: COLOR_THEMES.label.red,
    progressColor: 'red',
  },
  [ORDER_STATE.CANCELLED]: {
    label: '已作廢',
    colors: COLOR_THEMES.label.dark,
    progressColor: 'green',
  },
} as const

export type OrderState = keyof typeof OrderStateMap

// 根據路線獲取狀態列表（按業務邏輯順序）
export const getStatesByRoute = (route: StateRoute): OrderState[] => {
  const routeOrderMap: Record<StateRoute, OrderState[]> = {
    normal: [
      ORDER_STATE.PENDING_UPLOAD,
      ORDER_STATE.MATERIAL_UPLOADED,
      ORDER_STATE.VIDEO_PRODUCTION,
      ORDER_STATE.PENDING_CONFIRMATION,
      ORDER_STATE.PENDING_SCHEDULE,
      ORDER_STATE.BROADCASTED,
    ],
    edit: [
      ORDER_STATE.PENDING_UPLOAD,
      ORDER_STATE.MATERIAL_UPLOADED,
      ORDER_STATE.VIDEO_PRODUCTION,
      ORDER_STATE.PENDING_CONFIRMATION,
      ORDER_STATE.MODIFICATION_REQUEST,
      ORDER_STATE.PENDING_QUOTE_CONFIRMATION,
      ORDER_STATE.TRANSFERRED,
    ],
    transferred: [
      ORDER_STATE.PENDING_UPLOAD,
      ORDER_STATE.MATERIAL_UPLOADED,
      ORDER_STATE.VIDEO_PRODUCTION,
      ORDER_STATE.PENDING_CONFIRMATION,
      ORDER_STATE.MODIFICATION_REQUEST,
      ORDER_STATE.PENDING_QUOTE_CONFIRMATION,
      ORDER_STATE.TRANSFERRED,
    ],
    setTime: [
      ORDER_STATE.PENDING_UPLOAD,
      ORDER_STATE.MATERIAL_UPLOADED,
      ORDER_STATE.VIDEO_PRODUCTION,
      ORDER_STATE.PENDING_BROADCAST_DATE,
      ORDER_STATE.PENDING_CONFIRMATION,
      ORDER_STATE.PENDING_SCHEDULE,
      ORDER_STATE.BROADCASTED,
    ],
    cancel: [ORDER_STATE.CANCELLED],
  }

  return routeOrderMap[route] || []
}

export const getCurrentRoute = (state: OrderState): StateRoute => {
  if (state === ORDER_STATE.CANCELLED) {
    return 'cancel'
  }
  if (state === ORDER_STATE.TRANSFERRED) {
    return 'transferred'
  }
  if (
    state === ORDER_STATE.MODIFICATION_REQUEST ||
    state === ORDER_STATE.PENDING_QUOTE_CONFIRMATION
  ) {
    return 'edit'
  }
  if (state === ORDER_STATE.PENDING_BROADCAST_DATE) {
    return 'setTime'
  }
  return 'normal'
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

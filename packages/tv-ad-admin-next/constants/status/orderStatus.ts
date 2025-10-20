import { COLOR_THEMES } from './colors'

export type StatusRoute =
  | 'normal'
  | 'cancel'
  | 'setTime'
  | 'edit'
  | 'transferred'

export const ORDER_STATUS = {
  PENDING_UPLOAD: 'paid',
  MATERIAL_UPLOADED: 'file_uploaded',
  VIDEO_PRODUCTION: 'material_confirmed',
  PENDING_CONFIRMATION: 'material_updated',
  PENDING_SCHEDULE: 'produced',
  BROADCASTED: 'video_confirmed',
  MODIFICATION_REQUEST: 'scheduled',
  PENDING_QUOTE_CONFIRMATION: 'broadcasted',
  TRANSFERRED: 'transferred',
  PENDING_BROADCAST_DATE: 'pending_broadcast_date',
  CANCELLED: 'cancelled',
} as const

export const OrderStatusMap = {
  [ORDER_STATUS.PENDING_UPLOAD]: {
    label: '待上傳素材',
    colors: COLOR_THEMES.label.gray,
    progressColor: 'red',
  },
  [ORDER_STATUS.MATERIAL_UPLOADED]: {
    label: '素材已上傳',
    colors: COLOR_THEMES.label.yellow,
    progressColor: 'yellow',
  },
  [ORDER_STATUS.VIDEO_PRODUCTION]: {
    label: '影片製作中',
    colors: COLOR_THEMES.label.yellow,
    progressColor: 'yellow',
  },
  [ORDER_STATUS.PENDING_CONFIRMATION]: {
    label: '待確認',
    colors: COLOR_THEMES.label.red,
    progressColor: 'red',
  },
  [ORDER_STATUS.PENDING_SCHEDULE]: {
    label: '待排播',
    colors: COLOR_THEMES.label.blue,
    progressColor: 'green',
  },
  [ORDER_STATUS.BROADCASTED]: {
    label: '已播出',
    colors: COLOR_THEMES.label.green,
    progressColor: 'green',
  },
  [ORDER_STATUS.MODIFICATION_REQUEST]: {
    label: '提出修改要求',
    colors: COLOR_THEMES.label.yellow,
    progressColor: 'orange',
  },
  [ORDER_STATUS.PENDING_QUOTE_CONFIRMATION]: {
    label: '待確認修改報價',
    colors: COLOR_THEMES.label.red,
    progressColor: 'red',
  },
  [ORDER_STATUS.TRANSFERRED]: {
    label: '已轉移',
    colors: COLOR_THEMES.label.dark,
    progressColor: 'green',
  },
  [ORDER_STATUS.PENDING_BROADCAST_DATE]: {
    label: '待設定排播日期',
    colors: COLOR_THEMES.label.red,
    progressColor: 'red',
  },
  [ORDER_STATUS.CANCELLED]: {
    label: '已作廢',
    colors: COLOR_THEMES.label.dark,
    progressColor: 'green',
  },
} as const

export type OrderStatus = keyof typeof OrderStatusMap

// 根據路線獲取狀態列表（按業務邏輯順序）
export const getStatusesByRoute = (route: StatusRoute): OrderStatus[] => {
  const routeOrderMap: Record<StatusRoute, OrderStatus[]> = {
    normal: [
      ORDER_STATUS.PENDING_UPLOAD,
      ORDER_STATUS.MATERIAL_UPLOADED,
      ORDER_STATUS.VIDEO_PRODUCTION,
      ORDER_STATUS.PENDING_CONFIRMATION,
      ORDER_STATUS.PENDING_SCHEDULE,
      ORDER_STATUS.BROADCASTED,
    ],
    edit: [
      ORDER_STATUS.PENDING_UPLOAD,
      ORDER_STATUS.MATERIAL_UPLOADED,
      ORDER_STATUS.VIDEO_PRODUCTION,
      ORDER_STATUS.PENDING_CONFIRMATION,
      ORDER_STATUS.MODIFICATION_REQUEST,
      ORDER_STATUS.PENDING_QUOTE_CONFIRMATION,
      ORDER_STATUS.TRANSFERRED,
    ],
    transferred: [
      ORDER_STATUS.PENDING_UPLOAD,
      ORDER_STATUS.MATERIAL_UPLOADED,
      ORDER_STATUS.VIDEO_PRODUCTION,
      ORDER_STATUS.PENDING_CONFIRMATION,
      ORDER_STATUS.MODIFICATION_REQUEST,
      ORDER_STATUS.PENDING_QUOTE_CONFIRMATION,
      ORDER_STATUS.TRANSFERRED,
    ],
    setTime: [
      ORDER_STATUS.PENDING_UPLOAD,
      ORDER_STATUS.MATERIAL_UPLOADED,
      ORDER_STATUS.VIDEO_PRODUCTION,
      ORDER_STATUS.PENDING_BROADCAST_DATE,
      ORDER_STATUS.PENDING_CONFIRMATION,
      ORDER_STATUS.PENDING_SCHEDULE,
      ORDER_STATUS.BROADCASTED,
    ],
    cancel: [ORDER_STATUS.CANCELLED],
  }

  return routeOrderMap[route] || []
}

export const getCurrentRoute = (status: OrderStatus): StatusRoute => {
  if (status === ORDER_STATUS.CANCELLED) {
    return 'cancel'
  }
  if (status === ORDER_STATUS.TRANSFERRED) {
    return 'transferred'
  }
  if (
    status === ORDER_STATUS.MODIFICATION_REQUEST ||
    status === ORDER_STATUS.PENDING_QUOTE_CONFIRMATION
  ) {
    return 'edit'
  }
  if (status === ORDER_STATUS.PENDING_BROADCAST_DATE) {
    return 'setTime'
  }
  return 'normal'
}

export const PROGRESS_COLOR_RULES = {
  getActiveColor: (
    status: OrderStatus,
    type: 'text' | 'bg' = 'text'
  ): string => {
    const statusConfig = OrderStatusMap[status]
    const colorKey = statusConfig.progressColor

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

export const ORDER_STATUS_CONFIG = {
  PREVIEW_REQUIRED_STATUSES: [
    ORDER_STATUS.PENDING_CONFIRMATION,
    ORDER_STATUS.PENDING_SCHEDULE,
    ORDER_STATUS.BROADCASTED,
    ORDER_STATUS.MODIFICATION_REQUEST,
    ORDER_STATUS.PENDING_BROADCAST_DATE,
  ] as const,
}

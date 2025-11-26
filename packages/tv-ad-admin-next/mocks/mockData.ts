import { type OrderState, ORDER_STATE } from '../constants'

export type OrderRecord = {
  id: string
  orderNumber: string
  productName: string
  broadcastDate: string
  state: OrderState
  updatedAt: string
  relatedOrder?: OrderRecord // TODO: use parentOrder instead
  createdAt: string
}

export const mockOrderData: OrderRecord[] = [
  {
    id: '1',
    orderNumber: '#A3F2K9',
    productName: '夏季促銷商品',
    broadcastDate: '2024/4/16-2024/12/20',
    state: ORDER_STATE.PENDING_UPLOAD,
    updatedAt: '2025/12/25',
    createdAt: '2025/12/25',
  },
  {
    id: '2',
    orderNumber: '#B4E8D4',
    productName: '冬季特賣會',
    broadcastDate: '2024/4/15-2024/4/19',
    state: ORDER_STATE.MATERIAL_UPLOADED,
    updatedAt: '2025/12/23',
    createdAt: '2025/12/23',
  },

  {
    id: '3',
    orderNumber: '#C5F9H1',
    productName: '春季新品發布',
    broadcastDate: '2024/3/2-2024/12/28',
    state: ORDER_STATE.VIDEO_PRODUCTION,
    updatedAt: '2025/12/20',
    createdAt: '2025/12/20',
  },

  {
    id: '4',
    orderNumber: '#D6I2J3',
    productName: '秋季清倉優惠',
    broadcastDate: '2024/5/27-2024/1/9',
    state: ORDER_STATE.PENDING_CONFIRMATION,
    updatedAt: '2025/12/22',
    createdAt: '2025/12/22',
  },

  {
    id: '5',
    orderNumber: '#E7K4L5',
    productName: '聖誕節限量版',
    broadcastDate: '2024/3/24-2024/4/11',
    state: ORDER_STATE.PENDING_SCHEDULE,
    updatedAt: '2025/12/24',
    createdAt: '2025/12/24',
  },

  {
    id: '6',
    orderNumber: '#F8M6N7',
    productName: '新年賀歲專案',
    broadcastDate: '2024/6/7-2025/9/14',
    state: ORDER_STATE.BROADCASTED,
    updatedAt: '2025/12/19',
    createdAt: '2025/12/19',
  },

  {
    id: '7',
    orderNumber: '#G9O8P9',
    productName: '情人節甜蜜禮盒',
    broadcastDate: '2024/1/8-2024/12/10',
    state: ORDER_STATE.MODIFICATION_REQUEST,
    updatedAt: '2025/12/18',
    createdAt: '2025/12/18',
  },

  {
    id: '8',
    orderNumber: '#H0Q1R2',
    productName: '母親節溫馨獻禮',
    broadcastDate: '2024/8/14-2024/12/26',
    state: ORDER_STATE.PENDING_QUOTE_CONFIRMATION,
    updatedAt: '2025/12/15',
    createdAt: '2025/12/15',
  },

  {
    id: '9',
    orderNumber: '#I1S3T4',
    productName: '父親節感恩特惠',
    broadcastDate: '2023/12/29-2024/12/20',
    state: ORDER_STATE.TRANSFERRED,
    updatedAt: '2025/12/14',
    createdAt: '2025/12/14',
  },

  {
    id: '10',
    orderNumber: '#J2U5V6',
    productName: '兒童節歡樂禮品',
    broadcastDate: '2024/12/28-2025/1/11',
    state: ORDER_STATE.PENDING_BROADCAST_DATE,
    updatedAt: '2025/12/13',
    createdAt: '2025/12/13',
  },

  {
    id: '11',
    orderNumber: '#K3W7X8',
    productName: '中秋節團圓套餐',
    broadcastDate: '2024/12/29-2025/4/9',
    state: ORDER_STATE.CANCELLED,
    updatedAt: '2025/12/12',
    createdAt: '2025/12/12',
  },
]

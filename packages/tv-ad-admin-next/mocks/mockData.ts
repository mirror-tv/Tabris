import { type OrderStatus, ORDER_STATUS } from '../constants'

export type OrderRecord = {
  id: string
  orderNumber: string
  productName: string
  broadcastDate: string
  status: OrderStatus
  lastUpdated: string
  related?: OrderRecord
}

export const mockOrderData: OrderRecord[] = [
  {
    id: '1',
    orderNumber: '#A3F2K9',
    productName: '夏季促銷商品',
    broadcastDate: '2024/4/16-2024/12/20',
    status: ORDER_STATUS.PENDING_UPLOAD,
    lastUpdated: '2025/12/25',
  },
  {
    id: '2',
    orderNumber: '#B4E8D4',
    productName: '冬季特賣會',
    broadcastDate: '2024/4/15-2024/4/19',
    status: ORDER_STATUS.MATERIAL_UPLOADED,
    lastUpdated: '2025/12/23',
    related: {
      id: '2-1',
      orderNumber: '#B4E8D4',
      productName: '冬季特賣會',
      broadcastDate: '2024/4/15-2024/4/19',
      status: ORDER_STATUS.MODIFICATION_REQUEST,
      lastUpdated: '2025/12/23',
      related: {
        id: '2-2',
        orderNumber: '#B4E8D4',
        productName: '冬季特賣會',
        broadcastDate: '2024/4/15-2024/4/19',
        status: ORDER_STATUS.VIDEO_PRODUCTION,
        lastUpdated: '2025/12/23',
      },
    },
  },

  {
    id: '3',
    orderNumber: '#C5F9H1',
    productName: '春季新品發布',
    broadcastDate: '2024/3/2-2024/12/28',
    status: ORDER_STATUS.VIDEO_PRODUCTION,
    lastUpdated: '2025/12/20',
  },

  {
    id: '4',
    orderNumber: '#D6I2J3',
    productName: '秋季清倉優惠',
    broadcastDate: '2024/5/27-2024/1/9',
    status: ORDER_STATUS.PENDING_CONFIRMATION,
    lastUpdated: '2025/12/22',
  },

  {
    id: '5',
    orderNumber: '#E7K4L5',
    productName: '聖誕節限量版',
    broadcastDate: '2024/3/24-2024/4/11',
    status: ORDER_STATUS.PENDING_SCHEDULE,
    lastUpdated: '2025/12/24',
  },

  {
    id: '6',
    orderNumber: '#F8M6N7',
    productName: '新年賀歲專案',
    broadcastDate: '2024/6/7-2025/9/14',
    status: ORDER_STATUS.BROADCASTED,
    lastUpdated: '2025/12/19',
  },

  {
    id: '7',
    orderNumber: '#G9O8P9',
    productName: '情人節甜蜜禮盒',
    broadcastDate: '2024/1/8-2024/12/10',
    status: ORDER_STATUS.MODIFICATION_REQUEST,
    lastUpdated: '2025/12/18',
    related: {
      id: '7-1',
      orderNumber: '#G9O8P9',
      productName: '情人節甜蜜禮盒',
      broadcastDate: '2024/1/8-2024/12/10',
      status: ORDER_STATUS.PENDING_CONFIRMATION,
      lastUpdated: '2025/12/18',
    },
  },

  {
    id: '8',
    orderNumber: '#H0Q1R2',
    productName: '母親節溫馨獻禮',
    broadcastDate: '2024/8/14-2024/12/26',
    status: ORDER_STATUS.PENDING_QUOTE_CONFIRMATION,
    lastUpdated: '2025/12/15',
    related: {
      id: '8-1',
      orderNumber: '#H0Q1R2',
      productName: '母親節溫馨獻禮',
      broadcastDate: '2024/8/14-2024/12/26',
      status: ORDER_STATUS.MODIFICATION_REQUEST,
      lastUpdated: '2025/12/15',
    },
  },

  {
    id: '9',
    orderNumber: '#I1S3T4',
    productName: '父親節感恩特惠',
    broadcastDate: '2023/12/29-2024/12/20',
    status: ORDER_STATUS.TRANSFERRED,
    lastUpdated: '2025/12/14',
  },

  {
    id: '10',
    orderNumber: '#J2U5V6',
    productName: '兒童節歡樂禮品',
    broadcastDate: '2024/12/28-2025/1/11',
    status: ORDER_STATUS.PENDING_BROADCAST_DATE,
    lastUpdated: '2025/12/13',
  },

  {
    id: '11',
    orderNumber: '#K3W7X8',
    productName: '中秋節團圓套餐',
    broadcastDate: '2024/12/29-2025/4/9',
    status: ORDER_STATUS.CANCELLED,
    lastUpdated: '2025/12/12',
  },
]

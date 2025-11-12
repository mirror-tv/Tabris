'use client'

import { useMemo } from 'react'

import { ErrorMessage } from '@/components/custom-ui/error-message'
import { LabeledField } from '@/components/custom-ui/labeled-field'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { layout } from '@/constants'
import { OrderRecordForUploadQuery } from '@/graphql/queries/orders'
import FileIcon from '@/public/icons/file.svg'
import { cn } from '@/utils'
import { groupOrdersForUpload } from '@/utils/order-grouping'

type OrderSelectFieldProps = {
  orders: OrderRecordForUploadQuery[]
  loading: boolean
  error?: string
  onSelect: (orderNumber: string) => void
}

type SelectGroupItem =
  | { type: 'label'; label: string }
  | { type: 'order'; order: OrderRecordForUploadQuery }

const labelId = 'order-select-label'

export default function OrderSelectField({
  orders,
  loading,
  error,
  onSelect,
}: OrderSelectFieldProps) {
  const orderedSelectItems = useMemo(() => {
    const items: SelectGroupItem[] = []

    const { newOrders, reuploadOrders } = groupOrdersForUpload(orders)

    if (newOrders.length > 0) {
      items.push({ type: 'label', label: '新訂單' })
      items.push(
        ...newOrders.map((o) => ({ type: 'order' as const, order: o }))
      )
    }

    if (reuploadOrders.length > 0) {
      items.push({ type: 'label', label: '待修改' })
      items.push(
        ...reuploadOrders.map((o) => ({ type: 'order' as const, order: o }))
      )
    }

    return items
  }, [orders])

  return (
    <LabeledField
      id={labelId}
      label="選擇訂單"
      labelIcon={<FileIcon />}
      className="relative"
    >
      <Select onValueChange={onSelect} disabled={loading}>
        <SelectTrigger
          id={labelId}
          className={cn(
            'w-full bg-gray-2 data-placeholder:bg-gray-2 data-placeholder:text-gray-5!',
            layout.hoverBorder,
            error && ['border border-red-7', 'focus:border-red-8']
          )}
        >
          <SelectValue
            placeholder={
              loading ? '讀取資料中...' : '請選擇要上傳 / 修改素材的訂單'
            }
          />
        </SelectTrigger>
        <SelectContent>
          {orderedSelectItems.map((item) =>
            item.type === 'label' ? (
              <SelectItem
                key={item.label}
                value={item.label!}
                disabled
                className={cn(
                  'relative cursor-default text-sm text-gray-10 select-none',
                  'flex items-center justify-center',
                  "before:mr-2 before:flex-1 before:border-t before:border-gray-5 before:content-['']",
                  "after:ml-2 after:flex-1 after:border-t after:border-gray-5 after:content-['']"
                )}
              >
                {item.label}
              </SelectItem>
            ) : (
              <SelectItem
                key={item.order!.orderNumber}
                value={item.order!.orderNumber}
                className="cursor-pointer"
              >
                {item.order!.orderNumber}
                {item.order!.name ? ` - ${item.order!.name}` : ' - 未命名'}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </LabeledField>
  )
}

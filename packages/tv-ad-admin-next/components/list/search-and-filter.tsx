import { LabeledField } from '../custom-ui/labeled-field'

import { CustomInput } from '@/components/custom-ui/custom-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type OrderState } from '@/constants'
import SearchIcon from '@/public/icons/search.svg'
import { OrderStateUtils } from '@/utils'


type SearchAndFilterProps = {
  searchKeyword: string
  onSearchChange: (value: string) => void
  orderState: OrderState | 'all'
  onStateChange: (value: OrderState | 'all') => void
}

const searchId = 'search'

export function SearchAndFilter({
  searchKeyword,
  onSearchChange,
  orderState,
  onStateChange,
}: SearchAndFilterProps) {
  const orderStateOptions = [
    { value: 'all', label: '全部狀態' },
    ...OrderStateUtils.getAllOptions(),
  ]

  return (
    <div className="mx-auto mb-6 flex flex-col items-start gap-6 rounded-xl border border-border-default bg-surface-primary p-6">
      <h4 className="text-text-primary">搜尋與篩選</h4>

      <div className="flex w-full flex-col gap-4 md:flex-row">
        <LabeledField
          id={searchId}
          label="搜尋關鍵字"
          className="w-full flex-1"
        >
          <CustomInput
            id={searchId}
            type="text"
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜尋商品名稱"
            icon={<SearchIcon />}
            className="w-full rounded-lg border-border-default bg-surface-tertiary py-3 text-sm placeholder-text-tertiary focus:border-transparent focus:ring-0 focus:outline-none focus-visible:ring-0"
          />
        </LabeledField>
        <div className="w-full flex-1">
          <label className="mb-2 block text-sm font-medium text-text-primary">
            訂單狀態
          </label>
          <Select
            value={orderState}
            onValueChange={(value) =>
              onStateChange(value as OrderState | 'all')
            }
          >
            <SelectTrigger className="min-h-[45px] w-full rounded-lg border-border-default bg-surface-tertiary py-3 text-sm focus:border-transparent focus:ring-0 focus:outline-none focus-visible:ring-0">
              <SelectValue placeholder="選擇狀態" />
            </SelectTrigger>
            <SelectContent>
              {orderStateOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

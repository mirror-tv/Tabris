import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OrderStatusUtils } from '@/utils'

type SearchAndFilterProps = {
  searchKeyword: string
  onSearchChange: (value: string) => void
  orderStatus: string
  onStatusChange: (value: string) => void
}

export function SearchAndFilter({
  searchKeyword,
  onSearchChange,
  orderStatus,
  onStatusChange,
}: SearchAndFilterProps) {
  const orderStatusOptions = [
    { value: 'all', label: '全部狀態' },
    ...OrderStatusUtils.getAllOptions(),
  ]

  return (
    <div className="mx-auto mb-6 flex flex-col items-start gap-6 rounded-xl border border-border-default bg-surface-primary p-6">
      <h4 className="text-text-primary">搜尋與篩選</h4>

      <div className="flex w-full flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-text-primary">
            搜尋關鍵字
          </label>
          <Input
            type="text"
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜尋商品名稱"
            icon={
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
            className="w-full rounded-lg border-border-default bg-surface-tertiary py-3 text-sm placeholder-text-tertiary focus:border-transparent focus:ring-0 focus:outline-none focus-visible:ring-0"
          />
        </div>
        <div className="w-full flex-1">
          <label className="mb-2 block text-sm font-medium text-text-primary">
            訂單狀態
          </label>
          <Select value={orderStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="min-h-[45px] w-full rounded-lg border-border-default bg-surface-tertiary py-3 text-sm focus:border-transparent focus:ring-0 focus:outline-none focus-visible:ring-0">
              <SelectValue placeholder="選擇狀態" />
            </SelectTrigger>
            <SelectContent>
              {orderStatusOptions.map((option) => (
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

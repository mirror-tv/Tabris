import { useState } from 'react'

import { DialogClose } from '@radix-ui/react-dialog'
import { format } from 'date-fns'

import { Badge, badgeVariants } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { type OrderStatus, ORDER_STATUS } from '@/constants'
import { cn, OrderStatusUtils } from '@/utils'

export default function Demo() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="min-h-screen space-y-8 bg-surface-secondary p-8">
      <h2 className="text-text-primary">Shadcn UI Showcase</h2>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <Input placeholder="Search keyword…" className="w-64" />
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部狀態</SelectItem>
            <SelectItem value={ORDER_STATUS.PENDING_UPLOAD}>
              待上傳素材
            </SelectItem>
            <SelectItem value="pending_production">影片製作中</SelectItem>
            <SelectItem value="available">可瀏覽</SelectItem>
          </SelectContent>
        </Select>
        <Button>Search</Button>
      </div>

      {/* DatePicker (Popover + Calendar) */}
      <div>
        <h3 className="mb-2 text-text-primary">Pick a Date</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-[260px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Table with Badges */}
      <div>
        <h3 className="mb-2 text-text-primary">Order Records</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>#A3F2K9</TableCell>
              <TableCell>Summer Promo</TableCell>
              <TableCell>
                <Badge variant="pending-upload">
                  {OrderStatusUtils.getLabel(ORDER_STATUS.PENDING_UPLOAD)}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>#B4EBD4</TableCell>
              <TableCell>Winter Fair</TableCell>
              <TableCell>
                <Badge variant="broadcasted">
                  {OrderStatusUtils.getLabel('broadcasted')}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Status Color Preview */}
      <div className="space-y-4">
        <h4 className="text-gray-900">狀態顏色預覽</h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {OrderStatusUtils.getAllOptions().map(({ value, label }) => {
            const colors = OrderStatusUtils.getColors(value as OrderStatus)
            const variant = OrderStatusUtils.getBadgeVariant(
              value as OrderStatus
            )
            return (
              <div
                key={value}
                className="rounded-lg border border-gray-200 p-3"
              >
                <Badge variant={variant as keyof typeof badgeVariants}>
                  {label}
                </Badge>
                <p className="mt-2 text-xs text-gray-600">Variant: {variant}</p>
                <p className="mt-1 text-xs text-gray-500">
                  背景: {colors.bg} • 文字: {colors.text}
                </p>
              </div>
            )
          })}
          {/* 額外的重複狀態示例 */}
          <div className="rounded-lg border border-gray-200 p-3">
            <Badge variant="material-uploaded">素材已上傳 (重複1)</Badge>
            <p className="mt-2 text-xs text-gray-600">
              Variant: material-uploaded
            </p>
          </div>
        </div>
      </div>

      {/* Dialog */}
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Upload Material</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-text-primary">
                Confirm Upload
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-text-secondary">
              Please confirm your order details before uploading.
            </p>
            <DialogFooter className="flex space-x-2">
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button variant="blue">Confirm Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

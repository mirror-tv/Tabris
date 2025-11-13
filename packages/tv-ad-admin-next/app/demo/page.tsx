'use client'
import { useState } from 'react'

import { DialogClose } from '@radix-ui/react-dialog'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'

import { CustomInput } from '@/components/custom-ui/custom-input'
import { DotLoader } from '@/components/custom-ui/dot-loader'
import { Badge, badgeVariants } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { ORDER_STATE, OrderStateMap } from '@/constants'
import { ENV } from '@/constants/environment-variables'
import { useResponsive } from '@/hooks/useResponsive'
import UploadIcon from '@/public/icons/upload.svg'
import { cn } from '@/utils'

export default function Demo() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { isMobile, isTablet, isDesktop } = useResponsive()

  if (!['local', 'dev'].includes(ENV)) {
    notFound()
  }

  return (
    <div className="min-h-screen space-y-8 bg-surface-secondary p-8">
      <h2 className="text-text-primary">Shadcn UI Showcase</h2>

      <div className="w-full bg-green-7 py-2 text-center text-white">
        {isMobile && 'Mobile view'}
        {isTablet && 'Tablet view'}
        {isDesktop && 'Desktop view'}
      </div>

      {/* button */}
      <div className="flex flex-wrap gap-2">
        {/* ───────────────────────────── */}
        {/* fill (Primary / Secondary) */}
        {/* ───────────────────────────── */}
        <Button>fill (Primary)</Button>
        <Button intent="secondary">fill (Secondary)</Button>

        {/* ───────────────────────────── */}
        {/* Outline (Primary / Secondary) */}
        {/* ───────────────────────────── */}
        <Button variant="outline">Outline (Primary)</Button>
        <Button variant="outline" intent="secondary">
          Outline (Secondary)
        </Button>

        {/* ───────────────────────────── */}
        {/* Icon buttons */}
        {/* ───────────────────────────── */}
        <Button variant="ghost" size="icon">
          <UploadIcon />
        </Button>
        <Button variant="outline" size="icon" intent="secondary">
          <UploadIcon />
        </Button>

        {/* ───────────────────────────── */}
        {/* Ghost / Link / Disabled */}
        {/* ───────────────────────────── */}
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button disabled>
          <UploadIcon />
          Disabled
        </Button>

        {/* ───────────────────────────── */}
        {/* Large button */}
        {/* ───────────────────────────── */}
        <Button size="lg">Large Fill (Primary)</Button>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <CustomInput placeholder="Search keyword…" className="w-64" />
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部狀態</SelectItem>
            <SelectItem value={ORDER_STATE.PENDING_UPLOAD}>
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
              intent="secondary"
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
              <TableHead>State</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>#A3F2K9</TableCell>
              <TableCell>Summer Promo</TableCell>
              <TableCell>
                <Badge variant="pending-upload">
                  {OrderStateMap[ORDER_STATE.PENDING_UPLOAD].label}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="outline">View</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>#B4EBD4</TableCell>
              <TableCell>Winter Fair</TableCell>
              <TableCell>
                <Badge variant="broadcasted">
                  {OrderStateMap[ORDER_STATE.BROADCASTED].label}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="outline">View</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* State Color Preview */}
      <div className="space-y-4">
        <h4 className="text-gray-900">狀態顏色預覽</h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(OrderStateMap).map((stateConfig) => {
            // const variant = stateConfig.colors
            return (
              <div
                key={stateConfig.label}
                className="rounded-lg border border-gray-200 p-3"
              >
                <Badge
                  variant={stateConfig.colors.bg as keyof typeof badgeVariants}
                >
                  {stateConfig.label}
                </Badge>
                <p className="mt-2 text-xs text-gray-600">
                  Variant: {stateConfig.colors.bg}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  背景: {stateConfig.colors.bg} • 文字:{' '}
                  {stateConfig.colors.text}
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
            <Button>Upload Material</Button>
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
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button>Confirm Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Spinner Demo  */}
      <section>
        <h3 className="mb-2 text-text-primary">Spinner</h3>
        <div className="flex items-center gap-6">
          <Spinner />
          <Spinner className="size-6 text-brand-primary" />
          <Spinner className="size-8 text-gray-5" />
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Spinner className="size-4" />
            <span>Loading...</span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <DotLoader /> {/* default 3 dots */}
          <DotLoader count={5} /> {/* five dots */}
          <DotLoader className="text-brand-primary" /> {/* brand color */}
          <DotLoader dotClassName="h-3 w-3" /> {/* larger dots */}
          <DotLoader intervalMs={300} /> {/* slower sequence */}
        </div>
      </section>

      {/* Skeleton Demo */}
      <div>
        <h3 className="mb-2 text-text-primary">Skeleton</h3>
        <div className="space-y-3">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[180px]" />
        </div>
      </div>

      {/* Card Demo */}
      <div>
        <h3 className="mb-2 text-text-primary">Card</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This is a simple card with content and footer.</p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>

          <Card variant="note">
            <CardHeader>
              <CardTitle>Note Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                This card uses the “note” variant with yellow accent colors.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

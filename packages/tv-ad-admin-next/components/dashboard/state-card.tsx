import ArrowRightIcon from '@/public/icons/arrow-right.svg'
import { cn } from '@/utils'

type StateCardProps = {
  count: number
  text: string
  color: string
  bgColor: string
}

export default function StateCard({
  count,
  text,
  color,
  bgColor,
}: StateCardProps) {
  return (
    <div className={cn('flex flex-col rounded-md p-3', color, bgColor)}>
      <h2>{count}</h2>
      <div className="flex items-center justify-between">
        <span className={cn('typography-Caption1', color)}>{text}</span>
        <ArrowRightIcon />
      </div>
    </div>
  )
}

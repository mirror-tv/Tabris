import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementType,
} from 'react'

import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/utils'

type CardProps<T extends ElementType = 'section'> = {
  as?: T
} & ComponentProps<T>

function Card<T extends ElementType = 'section'>({
  as,
  className,
  ...props
}: CardProps<T>) {
  const Component = as || 'section'
  return (
    <Component
      data-slot="card"
      className={cn(
        'flex flex-col gap-6 rounded-lg border border-border-default bg-surface-primary p-6 text-card-foreground',
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  )
}

type CardTitleProps = ComponentPropsWithoutRef<'h4'> & {
  asChild?: boolean
}

function CardTitle({ asChild, className, ...props }: CardTitleProps) {
  const Comp = asChild ? Slot : 'h4'

  return (
    <Comp
      data-slot="card-title"
      className={cn('typography-h4 font-medium', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('typography-caption1 text-text-secondary', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-content" className={className} {...props} />
}

function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}

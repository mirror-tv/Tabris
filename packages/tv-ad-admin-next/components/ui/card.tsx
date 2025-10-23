import {
  createContext,
  useContext,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ElementType,
} from 'react'

import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/utils'

type CardVariant = 'default' | 'note'

type CardVariantContextValue = {
  variant: CardVariant
  isDefault: boolean
  isNote: boolean
}

const CardVariantContext = createContext<CardVariantContextValue>({
  variant: 'default',
  isDefault: true,
  isNote: false,
})

// Hook to use variant in children
function useCardVariant() {
  return useContext(CardVariantContext)
}

type CardProps<T extends ElementType = 'section'> = {
  as?: T
  variant?: 'default' | 'note'
} & ComponentProps<T>

function Card<T extends ElementType = 'section'>({
  as,
  variant = 'default',
  className,
  ...props
}: CardProps<T>) {
  const contextValue: CardVariantContextValue = {
    variant,
    isDefault: variant === 'default',
    isNote: variant === 'note',
  }
  const isDefault = contextValue.isDefault
  const isNote = contextValue.isNote
  const Component = as || (isNote && 'div') || 'section'
  return (
    <CardVariantContext.Provider value={contextValue}>
      <Component
        data-slot="card"
        className={cn(
          'flex flex-col rounded-lg border',
          isDefault &&
            'gap-6 border-border-default bg-surface-primary p-6 text-card-foreground',
          isNote &&
            'items-start gap-1 self-stretch border-yellow-3 bg-yellow-1 p-4 text-yellow-8',
          className
        )}
        {...props}
      />
    </CardVariantContext.Provider>
  )
}

function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  const { isNote } = useCardVariant()
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        isNote && 'text-yellow-7',
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
  const { isNote } = useCardVariant()
  const Comp = (isNote ? 'h6' : undefined) ?? (asChild ? Slot : 'h5')

  return (
    <Comp
      data-slot="card-title"
      className={cn(isNote && 'text-yellow-8', className)}
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
  const { isNote } = useCardVariant()

  return (
    <div
      data-slot="card-content"
      className={cn(isNote && 'typography-caption1 text-yellow-7', className)}
      {...props}
    />
  )
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

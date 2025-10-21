import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:bg-gray-3 disabled:text-gray-5 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      // NOTE: Use `intent` instead of `color` to avoid TypeScript conflicts with the native HTML <button> "color" attribute.
      intent: {
        primary: '',
        secondary: '',
      },
      variant: {
        // Adjusted version - shadcn origin default
        fill: 'bg-primary text-primary-foreground hover:bg-primary-hover focus:bg-primary-focus',
        // shadcn origin
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        // Adjusted version
        outline:
          'border border-blue-6 text-primary hover:text-blue-9 hover:border-blue-9 focus:border-blue-10 focus:text-blue-10 dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        // shadcn origin
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        // Adjusted version
        link: 'text-gray-6 underline-offset-2 underline hover:text-gray-9 focus:text-gray-5 disabled:bg-transparent',
      },
      // Adjusted version
      size: {
        default: 'h-8 rounded-sm px-3 has-[>svg]:px-3',
        lg: 'h-10 rounded-md px-4 has-[>svg]:px-4',
        icon: 'size-8',
      },
    },
    compoundVariants: [
      // fill + Secondary
      {
        variant: 'fill',
        intent: 'secondary',
        class:
          'bg-white border border-gray-4 text-gray-9 hover:border-gray-9 hover:bg-white focus:text-gray-6 focus:border-gray-6 focus:bg-white',
      },
      // Outline + Secondary
      {
        variant: 'outline',
        intent: 'secondary',
        class:
          'border border-gray-4 text-gray-9 hover:text-gray-9 hover:border-gray-9 focus:border-gray-8 focus:text-bray-10',
      },
    ],
    defaultVariants: {
      variant: 'fill',
      size: 'default',
      intent: 'primary',
    },
  }
)

type ButtonProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

const Button = forwardRef<ElementRef<'button'>, ButtonProps>(
  ({ className, variant, size, intent, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, intent, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

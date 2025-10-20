import type { ReactNode } from 'react'

import { layout } from '@/constants'
import { cn } from '@/utils'

type PageMainProps = {
  children: ReactNode
  className?: string
}

export default function PageMain({
  children,
  className,
  ...props
}: PageMainProps) {
  return (
    <main
      className={cn(
        'mx-auto mt-12 w-full md:mt-16', //offset for fixed header
        layout.maxWidthResponsive,
        className
      )}
      {...props}
    >
      {children}
    </main>
  )
}

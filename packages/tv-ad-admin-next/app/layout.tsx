import { Inter } from 'next/font/google'

import type { Metadata } from 'next'


import '../styles/globals.css'
import DevNavigation from '@/components/demo/dev-navigation'
import { cn } from '@/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TV Ad Admin',
  description: 'Mirror TV Advertising Management System',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body
        className={cn(
          'relative flex min-h-screen flex-col bg-surface-secondary text-foreground',
          inter.className
        )}
      >
        <DevNavigation />
        {children}
      </body>
    </html>
  )
}

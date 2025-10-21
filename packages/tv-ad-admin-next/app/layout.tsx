import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import DevNavigation from '@/components/demo/dev-navigation'
import { cn } from '@/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TV Ad Admin',
  description: 'Mirror TV Advertising Management System',
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
          'relative flex min-h-screen flex-col text-foreground bg-surface-secondary',
          inter.className
        )}
      >
        <DevNavigation />
        {children}
      </body>
    </html>
  )
}

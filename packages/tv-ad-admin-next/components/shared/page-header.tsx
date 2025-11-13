'use client'

import type { ReactNode } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '../ui/button'

import { layout } from '@/constants'
import ArrowBackIcon from '@/public/icons/arrow-back.svg'
import LogoutIcon from '@/public/icons/log-out.svg'
import LogoIcon from '@/public/icons/mnews-logo.svg'
import { useAuthStore } from '@/store'
import { cn } from '@/utils'

type PageHeaderProps =
  | { variant?: 'default'; title?: string }
  | { variant: 'centered'; title?: never }
  | { variant: 'spread'; title: string }

export default function PageHeader({
  title,
  variant = 'default',
}: PageHeaderProps) {
  const { logout } = useAuthStore()

  const isDefault = variant === 'default'
  const isCentered = variant === 'centered'
  const isSpread = variant === 'spread'

  const handleLogout = async () => {
    try {
      const logoutPromise = logout()
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 2000))

      await Promise.race([logoutPromise, timeoutPromise])
    } catch (error) {
      console.error('登出 API 錯誤:', error)
    }

    alert('登出成功')
    window.location.href = '/login'
  }

  return (
    <header
      className={cn(
        'fixed top-0 z-10 flex h-12 w-full items-center bg-surface-primary shadow-sm',
        'md:h-16 md:px-5 md:py-4'
      )}
    >
      <div
        className={cn(
          'm-auto flex w-full items-center',
          layout.maxWidthResponsive,
          isCentered && 'justify-center',
          isSpread && 'justify-between'
        )}
      >
        {isDefault && (
          <>
            <ArrowButton />
            <Title>{title}</Title>
          </>
        )}
        {isCentered && (
          <>
            <Logo />
          </>
        )}
        {isSpread && (
          <>
            <Logo className="hidden md:block" />
            <Title>{title}</Title>
            <Button variant="outline" intent="secondary" onClick={handleLogout}>
              <LogoutIcon className="size-4" />
              登出
            </Button>
          </>
        )}
      </div>
    </header>
  )
}

function ArrowButton() {
  const router = useRouter()
  const handleBack = () => {
    router.back()
  }
  return (
    <button
      onClick={handleBack}
      className="mr-3 flex size-6 items-center justify-center bg-transparent transition-colors hover:text-text-secondary focus:text-text-tertiary focus:outline-none md:size-8"
    >
      <ArrowBackIcon className="size-6" />
    </button>
  )
}

function Logo({ ...props }) {
  return (
    <Link href={'/'} {...props}>
      <LogoIcon width={144} height={36} />
    </Link>
  )
}

function Title({ children }: { children: ReactNode }) {
  return (
    <p className="text-base font-medium text-text-primary md:text-xl">
      {children}
    </p>
  )
}

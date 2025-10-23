'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { env } from '@/constants/environment-variables'

export default function DevNavigation() {
  const [open, setOpen] = useState(true)
  const isLocalOrDev = ['local', 'dev'].includes(env.ENV)

  if (!isLocalOrDev || !open) return null

  return (
    <nav className="fixed bottom-0 flex w-full shrink-0 justify-center gap-4 bg-gray-800 p-2 text-white z-50">
      <span className="flex items-center text-sm font-semibold tracking-wide whitespace-nowrap uppercase opacity-80">
        Dev Navigation
      </span>

      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        <Link href="/preview" className="hover:text-blue-400">
          Preview
        </Link>
        <Link href="/demo" className="hover:text-green-400">
          Demo
        </Link>
        <span className="font-extrabold">|</span>
        <Link href="/login" className="hover:text-purple-400">
          Login
        </Link>
        <Link href="/dashboard" className="hover:text-indigo-400">
          Dashboard
        </Link>
        <Link href="/upload" className="hover:text-pink-400">
          Upload
        </Link>
        <Link href="/list" className="hover:text-yellow-400">
          List
        </Link>
        <Link href="/order" className="hover:text-red-400">
          Order
        </Link>
        <Link href="/edit-request" className="hover:text-red-400">
          Edit-Request
        </Link>
        <Link href="/edit-schedule" className="hover:text-red-400">
          Edit-Schedule
        </Link>
      </div>

      <Button className="flex items-center" onClick={() => setOpen(false)}>
        close
      </Button>
    </nav>
  )
}

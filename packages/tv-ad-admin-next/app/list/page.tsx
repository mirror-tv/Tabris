'use client'

import { Suspense } from 'react'

import ListPageContent from '../../components/list/list-content'

import { Spinner } from '@/components/ui/spinner'

export default function ListPage() {
  return (
    <Suspense fallback={<Spinner className="size-15" />}>
      <ListPageContent />
    </Suspense>
  )
}

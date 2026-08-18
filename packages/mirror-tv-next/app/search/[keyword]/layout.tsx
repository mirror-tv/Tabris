import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
}

/** 搜尋頁惡意請求阻擋：keyword 結尾為 . + 三個英文字母時回傳 404 */
const BLOCKED_EXTENSION_PATTERN = /\.[a-zA-Z]{3}$/

function hasBlockedSearchExtension(keyword: string): boolean {
  return BLOCKED_EXTENSION_PATTERN.test(keyword.trim())
}

export default async function SearchPageLayout(props: {
  children: React.ReactNode
  params: Promise<{ keyword: string }>
}) {
  const params = await props.params

  const { children } = props

  const keyword = decodeURIComponent(params?.keyword ?? '')
  if (hasBlockedSearchExtension(keyword)) {
    notFound()
  }
  return <>{children}</>
}

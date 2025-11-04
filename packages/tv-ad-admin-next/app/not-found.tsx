import NotFoundTemplate from '@/components/shared/not-found-template'

export default function NotFoundPage() {
  return (
    <NotFoundTemplate
      status="404"
      message="頁面不存在，或您輸入的網址有誤。"
    />
  )
}
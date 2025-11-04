import NotFoundTemplate from '@/components/shared/not-found-template'

export default function NotFoundStatusPage({
  params,
}: {
  params: { status: string }
}) {
  const { status } = params

  const messageMap: Record<string, string> = {
    '400': '請求參數錯誤，請確認網址或資料格式。',
    '401': '尚未登入或登入已逾時。',
    '403': '您沒有權限存取此頁面。',
    '404': '找不到頁面或資源已被移除。',
    '500': '伺服器發生錯誤，請稍後再試。',
  }

  const message =
    messageMap[status] || '這個頁面可能已被移除或輸入的路徑錯誤。'

  return <NotFoundTemplate status={status} message={message} />
}

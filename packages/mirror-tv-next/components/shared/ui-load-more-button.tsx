// 按鈕UI本身不需要使用 'use client'

type UiLoadMoreButtonProps = {
  title: string
  onClick: () => void | Promise<void>
}

export default function UiLoadMoreButton({
  title,
  onClick,
}: UiLoadMoreButtonProps) {
  return <button onClick={onClick}>{title}</button>
}

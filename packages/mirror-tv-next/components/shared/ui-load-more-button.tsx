import styles from './_styles/ui-load-more-button.module.scss'

type UiLoadMoreButtonProps = {
  title: string
  onClick?: () => void | Promise<void>
  className?: string
}

export default function UiLoadMoreButton({
  title,
  onClick,
  className,
}: UiLoadMoreButtonProps) {
  return (
    <button
      onClick={onClick}
      className={[styles.customButton, 'g-button-load-more', className].join(
        ' '
      )}
    >
      {title}
    </button>
  )
}

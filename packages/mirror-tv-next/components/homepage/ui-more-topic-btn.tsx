import Link from 'next/link'
import styles from './_styles/ui-more-topic-btn.module.scss'

type UiLoadMoreButtonProps = {
  title: string
  link: string
  className?: string
}

export default function UiMoreTopicBtn({
  title,
  link,
  className,
}: UiLoadMoreButtonProps) {
  return (
    <Link
      href={link}
      target="_blank"
      rel="noreferrer noopener"
      className={[styles.customButton, className].join(' ')}
    >
      {title}
    </Link>
  )
}

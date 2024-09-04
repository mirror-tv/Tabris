// import UiPcFlashNews from '~/components/flash-news/ui-pc-flash-news'
import MainFlashNews from '~/components/flash-news/main-flash-news'
import OtherItems from '~/components/layout/header/other-items'
import styles from './_styles/header-bottom.module.scss'

export default function HeaderBottom(): JSX.Element {
  return (
    <div className={styles.headerBottomWrapper}>
      <MainFlashNews />
      <OtherItems />
    </div>
  )
}

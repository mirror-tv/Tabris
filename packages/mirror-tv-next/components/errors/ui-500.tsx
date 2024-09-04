import { Varela_Round } from 'next/font/google'
import styles from './_styles/ui-500.module.scss'
const font = Varela_Round({ subsets: ['latin'], weight: '400' })
export default function Ui500() {
  return (
    <div className={`${font.className} ${styles.main}`}>
      <div className={styles.container}>
        <div className={styles.error_info}>
          <h1 className={styles.error_info_heading}>
            50<span className={styles.drop_zero}>0</span>
          </h1>

          <p className="error_info_text">這個網頁無法正常運作</p>
        </div>
      </div>
    </div>
  )
}

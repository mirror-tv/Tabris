import styles from './_styles/ui-download.module.scss'
import { withBasePath } from '~/constants/with-base-path'

export type DownloadItem = {
  id: string
  name: string
  url: string
}

export type UiDownloadProps = {
  downloads: DownloadItem[]
}

export default function UiDownload({ downloads }: UiDownloadProps) {
  if (!downloads || downloads.length === 0) {
    return null
  }

  return (
    <div className={styles.download}>
      <h3>下載附件</h3>
      <div className={styles.download__list}>
        {downloads.map((download) => (
          <a
            key={download.id}
            href={download.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            <span className={styles.title}>{download.name}</span>
            <img
              src={withBasePath('/icons/download.svg')}
              alt="download"
              className={styles.btn}
            />
          </a>
        ))}
      </div>
    </div>
  )
}

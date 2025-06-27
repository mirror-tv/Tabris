import type { YoutubeListInfoFormatted, YoutubeResponse } from '~/types/youtube'
import YoutubeEmbed from '../shared/youtube-embed'
import styles from './_styles/anchor-show-list.module.scss'
import OpenInNew from '~/public/icons/open_in_new.svg'

type AnchorShowListProps = {
  list: {
    value: YoutubeResponse
    name: YoutubeListInfoFormatted
  }
}

export default async function AnchorShowList({ list }: AnchorShowListProps) {
  const { name, value } = list
  return (
    <section>
      <section className={styles.sectionWrapper}>
        <div className={styles.titleAndLink}>
          <h2 className={styles.sectionName}>{name.sectionName}</h2>
          <a
            className={styles.youtubeLink}
            target="_blank"
            rel="noreferrer noopener"
            href={`https://www.youtube.com/playlist?list=${name.url}`}
          >
            完整播放清單
            <OpenInNew />
          </a>
        </div>
        <ul className={styles.listContainer}>
          {value?.items?.map((ytItem, ytIndex) => {
            return (
              <li key={ytIndex + ytItem.id} className={styles.item}>
                <YoutubeEmbed
                  youtubeId={ytItem.snippet?.resourceId.videoId}
                  autoplay={false}
                  muted={false}
                  loop={true}
                  controls={true}
                />
                <a
                  className={styles.itemName}
                  href={`https://www.youtube.com/watch?v=${ytItem.snippet?.resourceId.videoId}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {ytItem.snippet.title}
                </a>
              </li>
            )
          })}
        </ul>
      </section>
    </section>
  )
}

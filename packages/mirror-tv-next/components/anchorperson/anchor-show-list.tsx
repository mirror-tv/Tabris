import { fetchYoutubeList } from '~/app/_actions/show-yt'
import type { FormatPlayListItems } from '~/types/api-data'
import { formateYoutubeListRes } from '~/utils'
import errors from '@twreporter/errors'
import YoutubeEmbed from '../shared/youtube-embed'
import styles from './_styles/anchor-show-list.module.scss'
import OpenInNew from '~/public/icons/open_in_new.svg'

type AnchorShowListProps = {
  urls: (string | null)[]
  listName: string
}

export default async function AnchorShowList({
  listName,
  urls = [],
}: AnchorShowListProps) {
  const getListId = (inputString: string | null) => {
    if (!inputString) return null
    const idWithName = inputString.includes('playlist?list=')
      ? inputString.split('list=')[1]
      : inputString.split('https://youtu.be/')[1]
    const id = idWithName.split('：')[0]
    return id
  }
  const youtubeListIds = urls
    .filter((url): url is string => url !== null)
    .map((url) => getListId(url))
    .filter((id): id is string | null => id !== null)

  let playListRendered: FormatPlayListItems | null = null

  for (const item of youtubeListIds) {
    try {
      const res = await fetchYoutubeList({
        list: { id: item as string, nextPageToken: '' },
        take: 3,
      })
      if (!res) continue
      const parsed = {
        ...formateYoutubeListRes(res),
        id: item ?? '',
      }
      playListRendered = parsed
      if (parsed.items && parsed.items.length) {
        break
      }
    } catch (error) {
      const annotatingError = errors.helpers.wrap(
        error,
        'UnhandledError',
        'Error occurs while fetching youtube list in anchor-person page'
      )
      console.error(
        JSON.stringify({
          severity: 'ERROR',
          message: errors.helpers.printAll(annotatingError, {
            withStack: false,
            withPayload: true,
          }),
        })
      )
    }
  }

  return (
    playListRendered?.items && (
      <section className={styles.sectionWrapper}>
        <div className={styles.titleAndLink}>
          <h2 className={styles.sectionName}>{listName}</h2>
          <a
            className={styles.youtubeLink}
            target="_blank"
            rel="noreferrer noopener"
          >
            完整播放清單
            <OpenInNew />
          </a>
        </div>
        <ul className={styles.listContainer}>
          {playListRendered?.items?.map((ytItem, index) => {
            return (
              <li key={index + ytItem.id} className={styles.item}>
                <YoutubeEmbed
                  youtubeId={ytItem.id}
                  autoplay={false}
                  muted={false}
                  loop={true}
                  controls={true}
                />
                <a
                  className={styles.itemName}
                  href={`https://www.youtube.com/watch?v=${ytItem.id}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {ytItem.title}
                </a>
              </li>
            )
          })}
        </ul>
      </section>
    )
  )
}

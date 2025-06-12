import { fetchYoutubeList } from '~/app/_actions/show-yt'
import { FormatPlayListItems } from '~/types/api-data'
import type { YoutubeListInfoFormatted, YoutubeResponse } from '~/types/youtube'
import { formateYoutubeListRes, handleResponse } from '~/utils'
import YoutubeEmbed from '../shared/youtube-embed'
import styles from './_styles/anchor-show-list.module.scss'
import OpenInNew from '~/public/icons/open_in_new.svg'

type AnchorShowListProps = {
  urls: (string | null)[]
}

export default async function AnchorShowList({
  urls = [],
}: AnchorShowListProps) {
  const getListIdAndName = (inputString: string | null) => {
    if (!inputString) return null
    const idWithName = inputString.includes('playlist?list=')
      ? inputString.split('list=')[1]
      : inputString.split('https://youtu.be/')[1]
    const [url, sectionName = inputString?.split('：')[1]] =
      idWithName.split('：')
    return { url, sectionName }
  }
  const youtubeListIds = urls
    .filter((url): url is string => url !== null)
    .map((url) => getListIdAndName(url))
    .filter((item): item is YoutubeListInfoFormatted => item?.url !== null)

  const listResponse = await Promise.allSettled(
    youtubeListIds.map((item) =>
      fetchYoutubeList({
        list: { id: item.url, nextPageToken: '' },
        take: 3,
      })
    )
  )
  const playListRendered: FormatPlayListItems[] = []

  listResponse.forEach((res, i) => {
    handleResponse(
      res,
      (res: Awaited<ReturnType<typeof fetchYoutubeList>> | undefined) => {
        if (!res) return
        playListRendered.push({
          ...formateYoutubeListRes(res, youtubeListIds[i].url),
          name: youtubeListIds[i].sectionName,
        })
      },
      'Error occurs while fetching youtube list in show page'
    )
  })
  const renderedList: {
    value: YoutubeResponse
    name: YoutubeListInfoFormatted
  }[] = []
  listResponse.forEach((res, i) => {
    if (res.status === 'fulfilled' && res.value?.items?.length) {
      renderedList.push({
        value: res.value,
        name: youtubeListIds[i],
      })
    }
  })

  renderedList.sort((a, b) => {
    const dateA = new Date(a.value.items?.[0]?.snippet?.publishedAt || 0)
    const dateB = new Date(b.value.items?.[0]?.snippet?.publishedAt || 0)
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <section>
      {renderedList.map(({ value, name }, index) => (
        <section className={styles.sectionWrapper} key={index}>
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
      ))}
    </section>
  )
}

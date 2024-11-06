import { fetchYoutubeList } from '../../../app/_actions/show-yt'
import { handleResponse } from '~/utils'
import type { FormatPlayListItems } from './youtube-list'
import YoutubeListHandler from './youtube-list-handler'
import { formateYoutubeListRes } from '~/utils'

type YoutubeListHandlerProps = {
  urls: (string | null)[]
  isDesktop: boolean
}

type YoutubeListInfoFormatted = {
  url: string
  sectionName: string
}

export default async function YoutubeListWrapper({
  urls = [],
  isDesktop,
}: YoutubeListHandlerProps) {
  const getListIdAndName = (inputString: string | null, index: number) => {
    if (!inputString) return null
    const idWithName = inputString.includes('playlist?list=')
      ? inputString.split('list=')[1]
      : inputString.split('https://youtu.be/')[1]
    const [
      url,
      sectionName = inputString?.split('：')[1] ??
        `選單 ${String.fromCharCode(index + 65)}`,
    ] = idWithName.split('：')
    return { url, sectionName }
  }
  const youtubeListIds = urls
    .filter((url): url is string => url !== null)
    .map((url, index) => getListIdAndName(url, index))
    .filter((item): item is YoutubeListInfoFormatted => item?.url !== null)

  const listResponse = await Promise.allSettled(
    youtubeListIds.map((item) =>
      fetchYoutubeList({
        list: { id: item.url, nextPageToken: '' },
        take: 30,
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
          ...formateYoutubeListRes(res),
          name: youtubeListIds[i].sectionName,
          id: youtubeListIds[i].url,
        })
      },
      'Error occurs while fetching youtube list in show page'
    )
  })

  return (
    <YoutubeListHandler playLists={playListRendered} isDesktop={isDesktop} />
  )
}

// import BlockquoteBlock from '../api-data-renderer/block-renderer/blockquote-block'
import HeadersBlock from '../api-data-renderer/block-renderer/headers-block'
import OrderListBlock from '../api-data-renderer/block-renderer/order-list-block'
import {
  type ApiData,
  type ApiDataBlock,
  ApiDataBlockType,
} from '../api-data-renderer/block-renderer/type'
import UnorderListBlock from '../api-data-renderer/block-renderer/unorder-list-block'
import AudioBlock from '../api-data-renderer/block-renderer/audio-block'
import VideoBlock from '../api-data-renderer/block-renderer/video-block'
import YoutubeBlock from '../api-data-renderer/block-renderer/youtube-block'
import AmpImageBlock from './blocks/amp-image-block'
import UnstyledBlock from '../api-data-renderer/block-renderer/unstyled-block'
import AmpEmbedded from './blocks/amp-embedded'
import AmpUnsupportedBlock from './blocks/amp-unsupported-block'

type AmpApiDataRendererPropsType = {
  contentData: string | ApiData
  isStoryBrief?: boolean
  currentUrl?: string
}

const AmpApiDataRenderer = ({
  contentData,
  isStoryBrief,
  currentUrl,
}: AmpApiDataRendererPropsType) => {
  // Handle both string and already-parsed object cases
  let parsedContentData: ApiData
  if (typeof contentData === 'string') {
    try {
      parsedContentData = JSON.parse(contentData)
    } catch (error) {
      console.error('Failed to parse contentData:', error)
      return null
    }
  } else if (Array.isArray(contentData)) {
    parsedContentData = contentData
  } else {
    console.error('Invalid contentData type:', typeof contentData)
    return null
  }

  if (parsedContentData?.length >= 4 && !isStoryBrief) {
    const newObject: ApiDataBlock = {
      id: 'inserted-gpt-ad',
      type: ApiDataBlockType.GptAd,
      content: '',
      alignment: 'center',
    }
    parsedContentData.splice(4, 0, newObject)
  }

  if (!parsedContentData?.length) {
    return null
  }

  return (
    <article className="amp-article-wrapper">
      {parsedContentData.map((apiDataBlock) => {
        switch (apiDataBlock.type) {
          case ApiDataBlockType.Unstyled:
            return (
              <UnstyledBlock
                data={apiDataBlock}
                key={apiDataBlock.id}
                isAmp={true}
              />
            )
          case ApiDataBlockType.HeaderOne:
          case ApiDataBlockType.HeaderTwo:
            return (
              <HeadersBlock
                data={apiDataBlock}
                blockType={apiDataBlock.type}
                key={apiDataBlock.id}
                isAmp={true}
              />
            )
          case ApiDataBlockType.Image:
            return <AmpImageBlock key={apiDataBlock.id} data={apiDataBlock} />
          // case ApiDataBlockType.Blockquote:
          //   return <BlockquoteBlock key={apiDataBlock.id} data={apiDataBlock} />
          case ApiDataBlockType.OrderList:
            return <OrderListBlock key={apiDataBlock.id} data={apiDataBlock} />
          case ApiDataBlockType.UnOrderList:
            return (
              <UnorderListBlock key={apiDataBlock.id} data={apiDataBlock} />
            )
          // case ApiDataBlockType.InfoBox:
          //   return <InfoBoxBlock key={apiDataBlock.id} data={apiDataBlock} />
          case ApiDataBlockType.EmbedCode:
            return (
              <AmpEmbedded
                key={apiDataBlock.id}
                data={apiDataBlock}
                currentUrl={currentUrl}
              />
            )
          case ApiDataBlockType.Audio:
            return <AudioBlock key={apiDataBlock.id} data={apiDataBlock} />
          case ApiDataBlockType.Video:
            return (
              <VideoBlock
                key={apiDataBlock.id}
                data={apiDataBlock}
                isAmp={true}
              />
            )
          case ApiDataBlockType.Youtube:
            return (
              <YoutubeBlock
                key={apiDataBlock.id}
                data={apiDataBlock}
                isAmp={true}
              />
            )
          case ApiDataBlockType.GptAd:
            return null
          default: {
            const exhaustiveCheck = apiDataBlock
            console.error('unhandled apiData type of amp', exhaustiveCheck.type)
            return (
              <AmpUnsupportedBlock
                key={apiDataBlock.id}
                currentUrl={currentUrl}
              />
            )
          }
        }
      })}
    </article>
  )
}

export default AmpApiDataRenderer

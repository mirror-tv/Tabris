import BlockquoteBlock from './block-renderer/blockquote-block'
import HeadersBlock from './block-renderer/headers-block'
import OrderListBlock from './block-renderer/order-list-block'
import {
  type ApiData,
  type ApiDataBlock,
  ApiDataBlockType,
} from './block-renderer/type'
import UnorderListBlock from './block-renderer/unorder-list-block'
import InfoBoxBlock from './block-renderer/info-box-block'
import EmbedCodeBlock from './block-renderer/embed-code-block'
import AudioBlock from './block-renderer/audio-block'
import AnnotationBlock from './block-renderer/annotation-block'
import SlideShowBlock from './block-renderer/slide-show-block'
import VideoBlock from './block-renderer/video-block'
import YoutubeBlock from './block-renderer/youtube-block'
import styles from './_styles/api-data-renderer.module.scss'
import ImageBlock from './block-renderer/image-block'
import UnstyledBlock from './block-renderer/unstyled-block'
import dynamic from 'next/dynamic'
const GPTAd = dynamic(() => import('~/components/ads/gpt/gpt-ad'))

type ApiDataRendererPropsType = {
  contentData: string | ApiData
  isStoryBrief?: boolean
}

const ApiDataRenderer = ({
  contentData,
  isStoryBrief,
}: ApiDataRendererPropsType) => {
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
      id: 'inserted-object-' + Date.now(),
      type: ApiDataBlockType.GptAd,
      content: '',
      alignment: 'center',
    }
    parsedContentData?.splice(4, 0, newObject)
  }

  return (
    <article className={styles.apiDataArticle}>
      {parsedContentData?.map((apiDataBlock) => {
        switch (apiDataBlock.type) {
          case ApiDataBlockType.Unstyled:
            if (!apiDataBlock.content?.[0]) {
              return null
            }
            return (
              <UnstyledBlock
                data={apiDataBlock}
                className={isStoryBrief ? styles.brief : ''}
                key={apiDataBlock.id}
              />
            )
          case ApiDataBlockType.HeaderOne:
          case ApiDataBlockType.HeaderTwo:
            return (
              <HeadersBlock
                data={apiDataBlock}
                blockType={apiDataBlock.type}
                key={apiDataBlock.id}
              />
            )
          case ApiDataBlockType.Image:
            return <ImageBlock key={apiDataBlock.id} data={apiDataBlock} />
          case ApiDataBlockType.Blockquote:
            return <BlockquoteBlock key={apiDataBlock.id} data={apiDataBlock} />
          case ApiDataBlockType.OrderList:
            return <OrderListBlock key={apiDataBlock.id} data={apiDataBlock} />
          case ApiDataBlockType.UnOrderList:
            return (
              <UnorderListBlock key={apiDataBlock.id} data={apiDataBlock} />
            )
          case ApiDataBlockType.InfoBox:
            return <InfoBoxBlock key={apiDataBlock.id} data={apiDataBlock} />
          case ApiDataBlockType.EmbedCode:
            return <EmbedCodeBlock key={apiDataBlock.id} data={apiDataBlock} />
          case ApiDataBlockType.Audio:
            return <AudioBlock key={apiDataBlock.id} data={apiDataBlock} />
          case ApiDataBlockType.Annotation:
            return <AnnotationBlock key={apiDataBlock.id} data={apiDataBlock} />
          case ApiDataBlockType.Slideshow:
            return <SlideShowBlock key={apiDataBlock.id} data={apiDataBlock} />
          case ApiDataBlockType.Video:
            return <VideoBlock key={apiDataBlock.id} data={apiDataBlock} />
          case ApiDataBlockType.Youtube:
            return <YoutubeBlock key={apiDataBlock.id} data={apiDataBlock} />
          case ApiDataBlockType.GptAd:
            return (
              <GPTAd pageKey="story" adKey="PC_AT1" key={apiDataBlock.id} />
            )
          default: {
            const exhaustiveCheck = apiDataBlock
            console.error('unhandled apiData type', exhaustiveCheck)
            return null
          }
        }
      })}
    </article>
  )
}

export default ApiDataRenderer

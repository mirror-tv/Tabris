import BlockquoteBlock from './block-renderer/blockquote-block'
import HeadersBlock from './block-renderer/headers-block'
import OrderListBlock from './block-renderer/order-list-block'
import {
  type ApiData,
  type ApiDataBlock,
  ApiDataBlockType,
} from './block-renderer/type'

/** 將 v2 區塊正規化為 Video/Slideshow/Audio 元件所需格式 */
function normalizeV2(
  raw: ApiDataBlock
): { block: ApiDataBlock; kind: 'video' | 'slideshow' | 'audio' } | null {
  const r = raw as {
    type: string
    content: unknown[]
    id: string
    alignment: string
    styles?: Record<string, string>
  }
  const c = r.content?.[0] as Record<string, unknown> | undefined
  if (r.type === ApiDataBlockType.VideoV2) {
    const v = c?.video as Record<string, unknown> | undefined
    const file = v?.file as { url?: string } | undefined
    const url =
      (typeof v?.videoSrc === 'string' ? v.videoSrc : null) ?? file?.url ?? ''
    return {
      kind: 'video',
      block: {
        id: r.id,
        type: ApiDataBlockType.Video,
        content: [
          {
            id: (v?.id as string) ?? r.id,
            name: (v?.name as string) ?? (c?.desc as string) ?? '',
            url,
            youtubeUrl: (v?.youtubeUrl as string | null) ?? null,
            coverPhoto:
              (v?.coverPhoto as { urlOriginal?: string })?.urlOriginal ??
              (v?.coverPhoto as { url?: string })?.url ??
              null,
          },
        ],
        alignment: (r.alignment as 'center') ?? 'center',
        style: r.styles ?? {},
      } as ApiDataBlock,
    }
  }
  if (r.type === ApiDataBlockType.SlideshowV2) {
    const images = (c?.images as Record<string, unknown>[]) ?? []
    const part = (url: string, w = 0, h = 0) => ({ url, width: w, height: h })
    const content = images.map((img) => {
      const file = img?.file as
        | { url?: string; width?: number; height?: number }
        | undefined
      const resized = img?.resized as
        | { original?: string; w1600?: string; w800?: string; w480?: string }
        | undefined
      const url =
        (typeof img?.url === 'string' ? img.url : null) ??
        file?.url ??
        resized?.original ??
        resized?.w1600 ??
        resized?.w800 ??
        resized?.w480 ??
        ''
      const w = file?.width ?? 0
      const h = file?.height ?? 0
      const p = part(url, w, h)
      return {
        id: (img?.id as string) ?? '',
        name: (img?.name as string) ?? '',
        url,
        title: img?.name ?? img?.desc ?? '',
        original: p,
        desktop: p,
        tablet: p,
        mobile: p,
        tiny: p,
      }
    })
    return {
      kind: 'slideshow',
      block: {
        id: r.id,
        type: ApiDataBlockType.Slideshow,
        content,
        alignment: (r.alignment as 'center') ?? 'center',
      } as ApiDataBlock,
    }
  }
  if (r.type === ApiDataBlockType.AudioV2) {
    const a = c?.audio as Record<string, unknown> | undefined
    const cov = a?.coverPhoto as
      | { id?: string; name?: string; urlOriginal?: string }
      | undefined
    return {
      kind: 'audio',
      block: {
        id: r.id,
        type: ApiDataBlockType.Audio,
        content: [
          {
            id: (a?.id as string) ?? r.id,
            name: (a?.name as string) ?? '',
            url: (a?.url as string) ?? '',
            coverPhoto: cov
              ? {
                  id: cov.id ?? '',
                  name: cov.name ?? '',
                  urlOriginal: cov.urlOriginal ?? '',
                }
              : { id: '', name: '', urlOriginal: '' },
          },
        ],
        alignment: (r.alignment as 'center') ?? 'center',
      } as ApiDataBlock,
    }
  }
  return null
}

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
import { STATIC_BASE_URL } from '~/constants/endpoint-config'
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
          case ApiDataBlockType.HeaderThree:
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
            return (
              <SlideShowBlock
                key={apiDataBlock.id}
                data={apiDataBlock}
                staticBaseUrl={STATIC_BASE_URL}
              />
            )
          case ApiDataBlockType.Video:
            return <VideoBlock key={apiDataBlock.id} data={apiDataBlock} />
          case ApiDataBlockType.VideoV2: {
            const v2 = normalizeV2(apiDataBlock)
            if (v2?.kind === 'video')
              return (
                <VideoBlock
                  key={v2.block?.id}
                  data={v2.block as Parameters<typeof VideoBlock>[0]['data']}
                />
              )
            return null
          }
          case ApiDataBlockType.SlideshowV2: {
            const v2 = normalizeV2(apiDataBlock)
            if (v2?.kind === 'slideshow')
              return (
                <SlideShowBlock
                  key={v2.block.id}
                  data={
                    v2.block as Parameters<typeof SlideShowBlock>[0]['data']
                  }
                  staticBaseUrl={STATIC_BASE_URL}
                />
              )
            return null
          }
          case ApiDataBlockType.AudioV2: {
            const v2 = normalizeV2(apiDataBlock)
            if (v2?.kind === 'audio')
              return (
                <AudioBlock
                  key={v2.block.id}
                  data={v2.block as Parameters<typeof AudioBlock>[0]['data']}
                />
              )
            return null
          }
          case ApiDataBlockType.Youtube:
            return <YoutubeBlock key={apiDataBlock.id} data={apiDataBlock} />
          case ApiDataBlockType.GptAd:
            return (
              <GPTAd pageKey="story" adKey="PC_AT1" key={apiDataBlock.id} />
            )
          default: {
            console.error('unhandled apiData type', apiDataBlock)
            return null
          }
        }
      })}
    </article>
  )
}

export default ApiDataRenderer

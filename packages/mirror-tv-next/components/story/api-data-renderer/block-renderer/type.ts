import { type ApiDataAnnotation } from './annotation-block'
import { type ApiDataAudio } from './audio-block'
import { type ApiDataBlockquote } from './blockquote-block'
import { type ApiDataEmbedCode } from './embed-code-block'
import { type ApiHeadersBlock } from './headers-block'
import { type ApiDataInfoBox } from './info-box-block'
import { type ApiDataOrderList } from './order-list-block'
import { type ApiDataSlideshow } from './slide-show-block'
import { type ApiDataUnorderListBlock } from './unorder-list-block'
import { type ApiDataUnstyled } from './unstyled-block'
import { type ApiDataVideo } from './video-block'
import { type ApiDataYoutube } from './youtube-block'
import { type ApiImageBlock } from './image-block'

enum ApiDataBlockType {
  Unstyled = 'unstyled',
  HeaderOne = 'header-one',
  HeaderTwo = 'header-two',
  HeaderThree = 'header-three',
  Blockquote = 'blockquote',
  UnOrderList = 'unordered-list-item',
  OrderList = 'ordered-list-item',
  Annotation = 'annotation',
  Video = 'video',
  VideoV2 = 'video-v2',
  Slideshow = 'slideshow',
  SlideshowV2 = 'slideshow-v2',
  InfoBox = 'infobox',
  Audio = 'audio',
  AudioV2 = 'audio-v2',
  EmbedCode = 'embeddedcode',
  Youtube = 'youtube',
  QuoteBy = 'quoteby',
  Image = 'image',
  GptAd = 'gpt-ad',
  Section = 'section',
}
type OrderListData = string[][]

// TODO: 使用interface 因為之後可以利用extends
interface ApiDataBlockBase {
  id: string
  type: ApiDataBlockType
  content: unknown[] | string
  alignment: 'center' | 'left' | 'right'
  textAlign?: 'center' | 'left'
}

interface GptAd extends ApiDataBlockBase {
  type: ApiDataBlockType.GptAd
  content: string
}

/** 與 unstyled 相同欄位，CMS 可能以 section 型別包一段 HTML */
export interface ApiDataSection extends ApiDataBlockBase {
  type: ApiDataBlockType.Section
  content: string | string[]
  alignment: 'center'
}

interface ApiDataVideoV2Block extends ApiDataBlockBase {
  type: ApiDataBlockType.VideoV2
  content: unknown[]
}
interface ApiDataSlideshowV2Block extends ApiDataBlockBase {
  type: ApiDataBlockType.SlideshowV2
  content: unknown[]
}
interface ApiDataAudioV2Block extends ApiDataBlockBase {
  type: ApiDataBlockType.AudioV2
  content: unknown[]
}

export type ApiDataBlock =
  | ApiDataUnorderListBlock
  | ApiDataInfoBox
  | ApiDataUnstyled
  | ApiDataSection
  | ApiHeadersBlock
  | ApiDataBlockquote
  | ApiDataOrderList
  | ApiDataEmbedCode
  | ApiDataAudio
  | ApiDataAnnotation
  | ApiDataSlideshow
  | ApiDataVideo
  | ApiDataYoutube
  | ApiImageBlock
  | GptAd
  | ApiDataVideoV2Block
  | ApiDataSlideshowV2Block
  | ApiDataAudioV2Block
export type ApiData = ApiDataBlock[]

/** New image API format: id, file, name, resized, resizedWebp, desc */
type ImageDataFormatNew = {
  id: string
  url?: string
  desc?: string
  name: string
  file: {
    url: string
    width: number
    height: number
    __typename?: string
  }
  resized: {
    w480?: string
    w800?: string
    w1200?: string
    w1600?: string
    w2400?: string
    original?: string
    __typename?: string
  }
  resizedWebp?: {
    w480?: string
    w800?: string
    w1200?: string
    w1600?: string
    w2400?: string
    original?: string
    __typename?: string
  }
  __typename?: string
}

type ImageDataFormatOld = {
  url: string
  original: {
    url: string
    width: number
    height: number
  }
  desktop: {
    url: string
    width: number
    height: number
  }
  tablet: {
    url: string
    width: number
    height: number
  }
  mobile: {
    url: string
    width: number
    height: number
  }
  tiny: {
    url: string
    width: number
    height: number
  }
  id: string
  name: string
  title: string
}

export {
  type ApiDataBlockBase,
  ApiDataBlockType,
  type OrderListData,
  type ImageDataFormatNew,
  type ImageDataFormatOld,
}

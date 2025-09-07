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
  Blockquote = 'blockquote',
  UnOrderList = 'unordered-list-item',
  OrderList = 'ordered-list-item',
  Annotation = 'annotation',
  Video = 'video',
  Slideshow = 'slideshow',
  InfoBox = 'infobox',
  Audio = 'audio',
  EmbedCode = 'embeddedcode',
  Youtube = 'youtube',
  QuoteBy = 'quoteby',
  Image = 'image',
  GptAd = 'gpt-ad',
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

export type ApiDataBlock =
  | ApiDataUnorderListBlock
  | ApiDataInfoBox
  | ApiDataUnstyled
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
export type ApiData = ApiDataBlock[]

type ImageDataFormatNew = {
  id: string
  desc: string
  name: string
  resized: {
    w480: string
    w800: string
    w1200: string
    w1600: string
    w2400: string
    original: string
    __typename: string
  }
  imageFile: {
    url: string
    width: number
    height: number
    __typename: string
  }
  __typename: string
  resizedWebp: {
    w480: string
    w800: string
    w1200: string
    w1600: string
    w2400: string
    original: string
    __typename: string
  }
  title: string
  description: string
  url: string
  original: {
    height: number
    width: number
    url: string
  }
  desktop: {
    height: number
    width: number
    url: string
  }
  tablet: {
    height: number
    width: number
    url: string
  }
  mobile: {
    height: number
    width: number
    url: string
  }
  tiny: {
    height: number
    width: number
    url: string
  }
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

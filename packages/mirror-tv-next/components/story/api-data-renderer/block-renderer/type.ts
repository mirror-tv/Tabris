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
export type ApiData = ApiDataBlock[]

export { type ApiDataBlockBase, ApiDataBlockType, type OrderListData }

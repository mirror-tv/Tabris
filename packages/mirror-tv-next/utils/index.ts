import type { PostImage } from './image-handler'
import { formateHeroImage, formatePostImage } from './image-handler'
import {
  extractYoutubeId,
  handleApiData,
  handleMetaDesc,
  handleResponse,
  FetchError,
} from './common'
import { formateDateAtTaipei } from './date-handler'
import {
  FormattedPostCard,
  FormattedPostCardJson,
  doesHaveBrief,
} from './post-handler'
import { formatArticleCard } from './post-handler'
import { formateYoutubeListRes, fetchYoutubeData } from './youtube'

export {
  extractYoutubeId,
  formatArticleCard,
  formateDateAtTaipei,
  formateHeroImage,
  formatePostImage,
  handleResponse,
  handleApiData,
  handleMetaDesc,
  formateYoutubeListRes,
  fetchYoutubeData,
  FetchError,
  doesHaveBrief,
}
export type { FormattedPostCard, PostImage, FormattedPostCardJson }

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
import { formateYoutubeListRes } from './youtube'
import {
  addMaxWidthToFigureWithStyle,
  removeDuplicateFirstParagraph,
} from './content-handler'

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
  FetchError,
  doesHaveBrief,
  addMaxWidthToFigureWithStyle,
  removeDuplicateFirstParagraph,
}
export type { FormattedPostCard, PostImage, FormattedPostCardJson }

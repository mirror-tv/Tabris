import type { FormattedResponsiveImage, PostImage } from './image-handler'
import { formateHeroImage } from './image-handler'
import {
  extractYoutubeId,
  handleApiData,
  handleMetaDesc,
  handleResponse,
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
import { isSotPost, getSotThumbnailObjectFit } from './post-style'

export {
  extractYoutubeId,
  formatArticleCard,
  formateDateAtTaipei,
  formateHeroImage,
  handleResponse,
  handleApiData,
  handleMetaDesc,
  formateYoutubeListRes,
  doesHaveBrief,
  addMaxWidthToFigureWithStyle,
  removeDuplicateFirstParagraph,
  isSotPost,
  getSotThumbnailObjectFit,
}
export type {
  FormattedPostCard,
  FormattedPostCardJson,
  FormattedResponsiveImage,
  PostImage,
}

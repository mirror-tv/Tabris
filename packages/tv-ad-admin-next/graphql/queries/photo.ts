import { gql } from '@apollo/client'

import { PhotoSchema } from '@/types/photo'

// * Represents the minimal photo data needed to retrieve its full public URL.
export type PhotoRecordForUploadPreview = Pick<
  PhotoSchema,
  'id' | 'name' | 'url'
>

export const getPhotoForUploadPreviewQuery = gql`
  query getPhotoForUploadPreview($where: PhotoWhereUniqueInput!) {
    photo(where: $where) {
      id
      name
      url
    }
  }
`

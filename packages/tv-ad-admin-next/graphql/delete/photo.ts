import { gql } from '@apollo/client'

export const deletePhotoMutation = gql`
  mutation DeletePhoto($where: PhotoWhereUniqueInput!) {
    deletePhoto(where: $where) {
      id
      name
    }
  }
`


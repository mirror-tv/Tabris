import { gql } from '@apollo/client'

export const uploadImageMutation = gql`
  mutation uploadImage($name: String!, $upload: Upload!) {
    createPhoto(data: { name: $name, imageFile: { upload: $upload } }) {
      id
      name
      url
    }
  }
`

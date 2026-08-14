import { VideoObject } from 'schema-dts'
import gql from 'graphql-tag'
import type { TypedDocumentNode } from '@apollo/client'

export type PostVideoObjects = {
  post: {
    id: string
    slug: string
    state: string
    videoObjects: VideoObject[] | null // JSON scalar
  }
}

const fetchPostVideoObjects: TypedDocumentNode<
  {
    post: {
      id: string
      slug: string
      state: string
      videoObjects: VideoObject[] | null
    }
  },
  { id: string }
> = gql`
  query fetchPostVideoObjects($id: ID!) {
    post(where: { id: $id }) {
      id
      slug
      state
      videoObjects
    }
  }
`

export { fetchPostVideoObjects }

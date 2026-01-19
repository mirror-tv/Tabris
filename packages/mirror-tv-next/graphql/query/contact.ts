import gql from 'graphql-tag'
import type { HeroImage } from '~/types/common'

export type Contact = {
  name: string
  slug: string
  anchorImg: HeroImage
}

export type SingleAnchor = Contact & {
  facebook: string | null
  instagram: string | null
  twitter: string | null
  bioApiData: string
  showhostImg: HeroImage
  relatedShows?: {
    id: string
    name: string
    playList01: string | null
    playList02: string | null
  }[]
  __typename: string
}

const fetchContactBySlug = gql`
  query fetchContactBySlug(
    $slug: String!
    $shouldFetchRelatedShows: Boolean = false
  ) {
    allContacts(where: { slug: $slug, isResigned_not: true }) {
      name
      facebook
      instagram
      twitter
      bioApiData
      showhostImg {
        imageApiData
      }
      relatedShows @include(if: $shouldFetchRelatedShows) {
        id
        name
        playList01
        playList02
      }
    }
  }
`
const fetchContactsByAnchorPerson = gql`
  query fetchContactsByAnchorPerson {
    allContacts(
      where: { anchorperson: true, isResigned_not: true }
      sortBy: [sortOrder_ASC, updatedAt_DESC]
    ) {
      name
      slug
      anchorImg {
        imageApiData
      }
    }
  }
`

const fetchContactsByHost = gql`
  query fetchContactsByHost {
    allContacts(
      where: { host: true, isResigned_not: true }
      sortBy: [sortOrder_ASC, updatedAt_DESC]
    ) {
      name
      slug
      anchorImg {
        imageApiData
      }
    }
  }
`

const fetchContactsByInternational = gql`
  query fetchContactsByInternational {
    allContacts(
      where: { international: true, isResigned_not: true }
      sortBy: [sortOrder_ASC, updatedAt_DESC]
    ) {
      name
      slug
      anchorImg {
        imageApiData
      }
    }
  }
`

export {
  fetchContactBySlug,
  fetchContactsByAnchorPerson,
  fetchContactsByHost,
  fetchContactsByInternational,
}

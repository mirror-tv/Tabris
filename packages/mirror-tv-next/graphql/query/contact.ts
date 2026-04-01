import gql from 'graphql-tag'
import type { HeroImage } from '~/types/common'
import { heroImageFragment } from '../fragments/hero-image'

export type Contact = {
  name: string
  slug: string
  anchorImg: HeroImage | null
}

export type SingleAnchor = Contact & {
  facebook: string | null
  instagram: string | null
  twitter: string | null
  bioApiData: string | null
  showhostImg: HeroImage | null
  relatedShows?: {
    id: string
    name: string
    playList01: string | null
    playList02: string | null
  }[]
  __typename?: string
}

const fetchContactBySlug = gql`
  query fetchContactBySlug(
    $slug: String!
    $shouldFetchRelatedShows: Boolean = false
  ) {
    allContacts: contacts(
      where: { slug: { equals: $slug }, isResigned: { not: { equals: true } } }
    ) {
      name
      facebook
      instagram
      twitter
      bioApiData
      showhostImg {
        ...heroImageFragment
      }
      relatedShows @include(if: $shouldFetchRelatedShows) {
        id
        name
        playList01
        playList02
      }
    }
  }
  ${heroImageFragment}
`
const fetchContactsByAnchorPerson = gql`
  query fetchContactsByAnchorPerson {
    allContacts: contacts(
      where: {
        anchorperson: { equals: true }
        isResigned: { not: { equals: true } }
      }
      orderBy: [{ sortOrder: asc }, { updatedAt: desc }]
    ) {
      name
      slug
      anchorImg {
        ...heroImageFragment
      }
    }
  }
  ${heroImageFragment}
`

const fetchContactsByHost = gql`
  query fetchContactsByHost {
    allContacts: contacts(
      where: { host: { equals: true }, isResigned: { not: { equals: true } } }
      orderBy: [{ sortOrder: asc }, { updatedAt: desc }]
    ) {
      name
      slug
      anchorImg {
        ...heroImageFragment
      }
    }
  }
  ${heroImageFragment}
`

const fetchContactsByInternational = gql`
  query fetchContactsByInternational {
    allContacts: contacts(
      where: {
        international: { equals: true }
        isResigned: { not: { equals: true } }
      }
      orderBy: [{ sortOrder: asc }, { updatedAt: desc }]
    ) {
      name
      slug
      anchorImg {
        ...heroImageFragment
      }
    }
  }
  ${heroImageFragment}
`

export {
  fetchContactBySlug,
  fetchContactsByAnchorPerson,
  fetchContactsByHost,
  fetchContactsByInternational,
}

import gql from 'graphql-tag'
import type { HeroImage } from '~/types/common'
import { heroImageFragment } from '../fragments/hero-image'

export type HostOrStaff = {
  slug: string
  name: string | null
  sortOrder: number | null
  bioApiData: string | null
  showhostImg?: HeroImage | null
  anchorImg?: HeroImage | null
}

export type ShowWithDetail = {
  slug: string | null
  name: string | null
  bannerImg: HeroImage | null
  picture: HeroImage | null
  hostName?: HostOrStaff[] | null
  staffName?: HostOrStaff[] | null
  introduction: string | null
  facebookUrl: string | null
  igUrl: string | null
  playList01: string | null
  playList02: string | null
  trailerPlaylist: string | null
}

const fetchShowBySlug = gql`
  query fetchShowBySlug(
    $slug: String!
    $shouldFetchHost: Boolean = false
    $shouldFetchStaff: Boolean = false
    $squareHostImg: Boolean = false
    $rectHostImg: Boolean = false
  ) {
    allShows: shows(where: { slug: { equals: $slug } }) {
      slug
      name
      bannerImg {
        ...heroImageFragment
      }
      picture {
        ...heroImageFragment
      }
      hostName(orderBy: [{ sortOrder: asc }, { id: desc }])
        @include(if: $shouldFetchHost) {
        slug
        name
        sortOrder
        bioApiData
        showhostImg @include(if: $squareHostImg) {
          ...heroImageFragment
        }
        anchorImg @include(if: $rectHostImg) {
          ...heroImageFragment
        }
      }
      staffName(orderBy: [{ sortOrder: asc }, { id: desc }])
        @include(if: $shouldFetchStaff) {
        slug
        name
        sortOrder
        bioApiData
        showhostImg @include(if: $squareHostImg) {
          ...heroImageFragment
        }
        anchorImg @include(if: $rectHostImg) {
          ...heroImageFragment
        }
      }
      introduction
      facebookUrl
      igUrl
      playList01
      playList02
      trailerPlaylist
    }
  }
  ${heroImageFragment}
`

export { fetchShowBySlug }

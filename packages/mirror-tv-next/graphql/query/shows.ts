import gql from 'graphql-tag'
import type { HeroImage } from '~/types/common'

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
    allShows(where: { slug: $slug }) {
      slug
      name
      bannerImg {
        imageApiData
      }
      picture {
        imageApiData
      }
      hostName(sortBy: [sortOrder_ASC, id_DESC])
        @include(if: $shouldFetchHost) {
        slug
        name
        sortOrder
        bioApiData
        showhostImg @include(if: $squareHostImg) {
          imageApiData
        }
        anchorImg @include(if: $rectHostImg) {
          imageApiData
        }
      }
      staffName(sortBy: [sortOrder_ASC, id_DESC])
        @include(if: $shouldFetchStaff) {
        slug
        name
        sortOrder
        bioApiData
        showhostImg @include(if: $squareHostImg) {
          imageApiData
        }
        anchorImg @include(if: $rectHostImg) {
          imageApiData
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
`

export { fetchShowBySlug }

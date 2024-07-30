import gql from 'graphql-tag'
import type { HeroImage } from '~/types/common'

export type Show = {
  id: string
  slug: string
  name: string
  bannerImg: HeroImage | null
}

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

const fetchShows = gql`
  query fetchShows {
    allShows(sortBy: [sortOrder_ASC, createdAt_DESC]) {
      id
      slug
      name
      bannerImg {
        urlMobileSized
        urlTabletSized
        urlOriginal
      }
    }
  }
`

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
        urlDesktopSized
        urlMobileSized
        urlTabletSized
        urlOriginal
      }
      picture {
        urlDesktopSized
        urlMobileSized
        urlTabletSized
        urlOriginal
      }
      hostName(sortBy: [sortOrder_ASC, id_DESC])
        @include(if: $shouldFetchHost) {
        slug
        name
        sortOrder
        bioApiData
        showhostImg @include(if: $squareHostImg) {
          urlMobileSized
          urlTabletSized
          urlOriginal
        }
        anchorImg @include(if: $rectHostImg) {
          urlMobileSized
          urlTabletSized
          urlOriginal
        }
      }
      staffName(sortBy: [sortOrder_ASC, id_DESC])
        @include(if: $shouldFetchStaff) {
        slug
        name
        sortOrder
        bioApiData
        showhostImg @include(if: $squareHostImg) {
          urlMobileSized
          urlTabletSized
          urlOriginal
        }
        anchorImg @include(if: $rectHostImg) {
          urlMobileSized
          urlTabletSized
          urlOriginal
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

export { fetchShows, fetchShowBySlug }

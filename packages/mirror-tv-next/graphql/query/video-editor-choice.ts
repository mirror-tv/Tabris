import gql from 'graphql-tag'
import type { HeroImage } from '~/types/common'
import { heroImageFragment } from '../fragments/hero-image'

export type VideoEditorChoice = {
  videoEditor: {
    slug: string | null
    name: string | null
    style: string
    heroImage: HeroImage | null
    heroVideo: {
      url: string
      coverPhoto: HeroImage | null
    } | null
  } | null
}

const getVideoEditorChoice = gql`
  query fetchVideoEditorChoices {
    allVideoEditorChoices: videoEditorChoices(
      where: {
        state: { equals: "published" }
        videoEditor: {
          state: { equals: "published" }
          style: { equals: "videoNews" }
        }
      }
      orderBy: { order: asc }
    ) {
      videoEditor {
        slug
        name
        style
        heroImage {
          ...heroImageFragment
        }
        heroVideo {
          url
          coverPhoto {
            ...heroImageFragment
          }
        }
      }
    }
  }
  ${heroImageFragment}
`

export { getVideoEditorChoice }

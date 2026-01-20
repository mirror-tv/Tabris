import gql from 'graphql-tag'
import type { HeroImage } from '~/types/common'

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
          imageApiData
        }
        heroVideo {
          url
          coverPhoto {
            imageApiData
          }
        }
      }
    }
  }
`

export { getVideoEditorChoice }

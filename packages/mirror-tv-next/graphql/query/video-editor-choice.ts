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
      coverPhoto: HeroImage
    } | null
  } | null
}

const getVideoEditorChoice = gql`
  query fetchVideoEditorChoices {
    allVideoEditorChoices(
      where: {
        state: published
        videoEditor: { state: published, style: videoNews }
      }
      sortBy: order_ASC
    ) {
      videoEditor {
        slug
        name
        style
        heroImage {
          urlMobileSized
          urlOriginal
        }
        heroVideo {
          url
          coverPhoto {
            urlMobileSized
            urlTabletSized
            urlDesktopSized
            urlOriginal
          }
        }
      }
    }
  }
`

export { getVideoEditorChoice }

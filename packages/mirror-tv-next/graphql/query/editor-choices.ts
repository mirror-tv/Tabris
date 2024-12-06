import gql from 'graphql-tag'
import { HeroImage } from '~/types/common'

export type EditorChoices = {
  choice: {
    name: string
    slug: string
    heroImage: HeroImage
    heroVideo: { coverPhoto: HeroImage }
  }
}

const fetchEditorChoices = gql`
  query fetchEditorChoices {
    allEditorChoices(
      where: { state: published, choice: { state: published } }
      sortBy: [sortOrder_ASC, createdAt_DESC]
    ) {
      choice {
        name
        slug
        heroImage {
          urlOriginal
          urlDesktopSized
          urlTabletSized
          urlMobileSized
          urlTinySized
        }
        heroVideo {
          coverPhoto {
            urlOriginal
            urlDesktopSized
            urlTabletSized
            urlMobileSized
            urlTinySized
          }
        }
      }
    }
  }
`

export { fetchEditorChoices }

import gql from 'graphql-tag'
import { HeroImage } from '~/types/common'

export type EditorChoices = {
  choice: {
    name: string
    slug: string
    source?: string
    heroImage: HeroImage
    heroVideo: { coverPhoto: HeroImage | null } | null
    exclusive: boolean
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
          imageApiData
        }
        heroVideo {
          coverPhoto {
            imageApiData
          }
        }
        exclusive
      }
    }
  }
`

export { fetchEditorChoices }

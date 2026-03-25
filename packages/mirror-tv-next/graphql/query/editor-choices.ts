import gql from 'graphql-tag'
import type { FormattableHeroImage } from '~/types/hero-image'

export type EditorChoices = {
  choice: {
    name: string
    slug: string
    source?: string | null
    heroImage: FormattableHeroImage
    heroVideo?: { coverPhoto: FormattableHeroImage } | null
    exclusive: boolean | null
  }
}

const fetchEditorChoices = gql`
  query fetchEditorChoices {
    allEditorChoices: editorChoices(
      where: {
        state: { equals: "published" }
        choice: { state: { equals: "published" } }
      }
      orderBy: [{ sortOrder: asc }, { createdAt: desc }]
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

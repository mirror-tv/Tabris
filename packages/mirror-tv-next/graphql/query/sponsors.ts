import gql from 'graphql-tag'
import type { HeroImage } from '~/types/common'

export type Sponsor = {
  id: string
  title: string
  url: string
  logo: HeroImage | null
  mobile: HeroImage | null
  tablet: HeroImage | null
  topic: {
    id: string
    slug: string
    name: string
  } | null
}

const fetchSponsors = gql`
  query fetchSponsors {
    allSponsors: sponsors(
      where: { state: { equals: "published" } }
      orderBy: [{ sortOrder: asc }, { createdAt: desc }]
    ) {
      id
      title
      url
      logo {
        imageApiData
      }
      mobile {
        imageApiData
      }
      tablet {
        imageApiData
      }
      topic {
        id
        slug
        name
      }
    }
  }
`

export { fetchSponsors }

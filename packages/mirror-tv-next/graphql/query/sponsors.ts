import gql from 'graphql-tag'
import { heroImageFragment } from '../fragments/hero-image'

export type Sponsor = {
  id: string
  title: string
  url: string
  logo: string | null
  mobile: string | null
  tablet: string | null
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
        ...heroImageFragment
      }
      mobile {
        ...heroImageFragment
      }
      tablet {
        ...heroImageFragment
      }
      topic {
        id
        slug
        name
      }
    }
  }
  ${heroImageFragment}
`

export { fetchSponsors }

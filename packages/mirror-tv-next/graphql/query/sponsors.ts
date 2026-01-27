import gql from 'graphql-tag'

export type Sponsor = {
  id: string
  title: string
  url: string
  logo: {
    urlMobileSized: string
  } | null
  mobile: {
    urlMobileSized: string
  } | null
  tablet: {
    urlMobileSized: string
  } | null
  topic: {
    id: string
    slug: string
    name: string
  } | null
}

const fetchSponsors = gql`
  query fetchSponsors {
    allSponsors(
      where: { state: published }
      sortBy: [sortOrder_ASC, createdAt_DESC]
    ) {
      id
      title
      url
      logo {
        urlMobileSized
      }
      mobile {
        urlMobileSized
      }
      tablet {
        urlMobileSized
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

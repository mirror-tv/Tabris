import gql from 'graphql-tag'

const heroImageFragment = gql`
  fragment heroImageFragment on Image {
    imageApiData
    resized {
      original
      w480
      w800
      w1200
      w1600
      w2400
    }
    resizedWebp {
      original
      w480
      w800
      w1200
      w1600
      w2400
    }
  }
`

export { heroImageFragment }

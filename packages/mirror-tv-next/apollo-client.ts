import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { registerApolloClient } from '@apollo/client-integration-nextjs'

import { API_ENDPOINT } from './constants/endpoint-config'

declare module '@apollo/client/core/defaultOptions.js' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace DeclareDefaultOptions {
    interface Query {
      errorPolicy: 'all'
    }
  }
}

declare module '@apollo/client/core/types.js' {
  interface TypeOverrides {
    signatureStyle: 'classic'
  }
}

export const { getClient, query, PreloadQuery } = registerApolloClient(
  () =>
    new ApolloClient({
      link: new HttpLink({
        uri: API_ENDPOINT,
      }),
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
      },
    })
)

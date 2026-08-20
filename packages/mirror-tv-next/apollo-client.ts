import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { registerApolloClient } from '@apollo/client-integration-nextjs'

import { API_ENDPOINT } from './constants/endpoint-config'

// Module augmentation targets the exported path '@apollo/client/core' because
// Apollo v4's package.json exports do not expose internal paths like
// './core/defaultOptions.js' or './core/types.js'. With moduleResolution:
// "Bundler", TypeScript strictly follows exports and rejects non-exported paths.
declare module '@apollo/client/core' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ApolloClient {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace DeclareDefaultOptions {
      interface Query {
        errorPolicy: 'all'
      }
    }
  }
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

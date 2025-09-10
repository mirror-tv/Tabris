import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { isServer } from '~/utils/common'

import { API_ENDPOINT } from './constants/config'

// reference: https://www.apollographql.com/blog/how-to-use-apollo-client-with-next-js-13
// makes sure that we only instance the Apollo Client once per request,
// since Apollo Client’s cache is designed with a single user in mind, we recommend that your Next.js server instantiates a new cache for each SSR request, rather than reusing the same long-lived instance for multiple users’ data.

let client: ApolloClient<any> | null = null

export const getClient = () => {
  // Always create a new client for server-side rendering to avoid $$id conflicts
  if (isServer()) {
    return new ApolloClient({
      link: new HttpLink({
        uri: API_ENDPOINT,
      }),
      cache: new InMemoryCache({
        // Disable cache normalization to avoid $$id conflicts
        dataIdFromObject: () => undefined,
      }),
      defaultOptions: {
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
      },
    })
  }

  // For client-side, reuse the existing client
  if (!client) {
    client = new ApolloClient({
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
  }
  return client
}

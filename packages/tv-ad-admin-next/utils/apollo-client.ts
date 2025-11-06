import { ApolloClient, InMemoryCache } from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'

import { GQL_ENDPOINT } from '@/constants/environment-variables'

// reference: https://www.apollographql.com/blog/how-to-use-apollo-client-with-next-js-13
// makes sure that we only instance the Apollo Client once per request,
// since Apollo Client's cache is designed with a single user in mind, we recommend that your Next.js server instantiates a new cache for each SSR request, rather than reusing the same long-lived instance for multiple users' data.

let client: ApolloClient<unknown> | null = null

const isServer = (): boolean => {
  return typeof window === 'undefined'
}

export const getClient = () => {
  if (!GQL_ENDPOINT) {
    throw new Error(
      'GQL_ENDPOINT is not configured. Please set GQL_ENDPOINT environment variable.'
    )
  }

  // creat a new client if there's no existing one
  // or if we are running on the server.
  if (!client || isServer()) {
    client = new ApolloClient({
      link: createUploadLink({
        uri: GQL_ENDPOINT,
        fetch: globalThis.fetch,
      }),
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
        mutate: { errorPolicy: 'all' },
      },
    })
  }
  return client
}

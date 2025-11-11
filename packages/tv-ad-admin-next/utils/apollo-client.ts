import { ApolloClient, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { createUploadLink } from 'apollo-upload-client'
import { GoogleAuth } from 'google-auth-library'

import { GQL_ENDPOINT } from '@/constants/environment-variables'

// reference: https://www.apollographql.com/blog/how-to-use-apollo-client-with-next-js-13
// makes sure that we only instance the Apollo Client once per request,
// since Apollo Client's cache is designed with a single user in mind, we recommend that your Next.js server instantiates a new cache for each SSR request, rather than reusing the same long-lived instance for multiple users' data.

let client: ApolloClient<unknown> | null = null

const isServer = (): boolean => {
  return typeof window === 'undefined'
}

const createAuthLink = () => {
  return setContext(async (_, { headers }) => {
    if (!isServer() || !GQL_ENDPOINT) {
      return { headers }
    }

    try {
      const auth = new GoogleAuth()
      const client = await auth.getIdTokenClient(GQL_ENDPOINT)
      const idToken = await client.idTokenProvider.fetchIdToken(GQL_ENDPOINT)

      return {
        headers: {
          ...headers,
          authorization: `Bearer ${idToken}`,
        },
      }
    } catch (error) {
      console.warn('Failed to fetch GCP ID Token:', error)
      return { headers }
    }
  })
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
    const uploadLink = createUploadLink({
      uri: GQL_ENDPOINT,
      fetch: globalThis.fetch,
    })

    const link = createAuthLink().concat(uploadLink)

    client = new ApolloClient({
      link,
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

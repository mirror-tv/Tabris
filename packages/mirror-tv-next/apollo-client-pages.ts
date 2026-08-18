import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  type OperationVariables,
} from '@apollo/client'
import { API_ENDPOINT } from './constants/endpoint-config'

export const getPagesApolloClient = () => {
  return new ApolloClient({
    ssrMode: true,
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

export const queryPages = <
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables
>(
  options: ApolloClient.QueryOptions<TData, TVariables>
) => {
  const client = getPagesApolloClient()
  return client.query<TData, TVariables>(options)
}

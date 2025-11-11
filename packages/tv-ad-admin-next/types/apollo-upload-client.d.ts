declare module 'apollo-upload-client' {
  import { ApolloLink } from '@apollo/client';
  interface CreateUploadLinkOptions {
    uri?: string;
    fetch?: typeof fetch;
    headers?: Record<string, string>;
  }
  export function createUploadLink(options?: CreateUploadLinkOptions): ApolloLink;
}

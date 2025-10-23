export const env = {
  ENV: process.env.NEXT_PUBLIC_ENV ?? 'dev',
  GQL_ENDPOINT:
    process.env.GQL_ENDPOINT ?? 'https://your-cms-api.example.com/api/graphql',
}

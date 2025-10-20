const ENV = process.env.NEXT_PUBLIC_ENV || 'dev'

export const env = {
  ENV,
} as const

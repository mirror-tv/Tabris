import { createErrorLogger } from './log'

type DataFetchFunction<T> = () => Promise<T>

export const createDataFetchingChain = async <T>(
  errorLogger: ReturnType<typeof createErrorLogger>,
  defaultValue: T,
  ...dataFetchFunc: DataFetchFunction<T>[]
): Promise<T> => {
  // use promise.catch to build a chain of fallback handlers

  let chain: Promise<T> = Promise.reject()

  for (const func of dataFetchFunc) {
    chain = chain.catch((err) => {
      if (err) errorLogger(err)

      return func()
    })
  }

  chain = chain.catch((err) => {
    errorLogger(err)

    return defaultValue
  })

  return chain
}

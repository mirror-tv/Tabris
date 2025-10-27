import { ApolloError } from '@apollo/client'
// @ts-expect-error - @twreporter/errors 沒有 TypeScript 定義
import errors from '@twreporter/errors'

export const createErrorLogger = (
  errorMessage: string,
  traceObject?: Record<string, unknown> | undefined
) => {
  return (error: unknown) => {
    const annotatingError = errors.helpers.wrap(
      error,
      'UnhandledError',
      errorMessage
    )

    if (error instanceof ApolloError) {
      const { graphQLErrors, clientErrors, networkError } = error
      console.error(
        JSON.stringify({
          severity: 'ERROR',
          message: errors.helpers.printAll(
            annotatingError,
            {
              withStack: true,
              withPayload: true,
            },
            0,
            0
          ),
          debugPayload: {
            graphQLErrors,
            clientErrors,
            networkError,
          },
          ...(traceObject ?? {}),
        })
      )
    } else if (error instanceof Error) {
      console.error(
        JSON.stringify({
          severity: 'ERROR',
          message: errors.helpers.printAll(
            annotatingError,
            {
              withStack: true,
              withPayload: true,
            },
            0,
            0
          ),
          debugPayload: {
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
          },
          ...(traceObject ?? {}),
        })
      )
    } else {
      console.error(
        JSON.stringify({
          severity: 'ERROR',
          message: errors.helpers.printAll(
            annotatingError,
            {
              withStack: true,
              withPayload: true,
            },
            0,
            0
          ),
          debugPayload: {
            error,
          },
          ...(traceObject ?? {}),
        })
      )
    }
  }
}

/**
 * 處理 Promise.allSettled 的結果
 * 統一處理成功和失敗的響應
 */
export const handleResponse = <
  T extends Record<string, unknown>,
  U extends PromiseSettledResult<T>,
  V,
>(
  response: U,
  callback: (value: T | undefined) => V,
  errorMessage: string
): V => {
  if (response.status === 'fulfilled') {
    return callback(response.value)
  } else if (response.status === 'rejected') {
    const annotatingError = errors.helpers.wrap(
      response.reason,
      'UnhandledError',
      errorMessage
    )

    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(
          annotatingError,
          {
            withStack: true,
            withPayload: true,
          },
          0,
          0
        ),
        debugPayload: {
          reason: response.reason,
        },
      })
    )
  }
  return callback(undefined)
}

/**
 * 自定義 FetchError 類別
 * 用於 API 請求失敗時的錯誤處理
 */
export class FetchError extends Error {
  public code: number
  public url: string

  constructor(url: string, message: string = 'Not Found', code: number = 404) {
    const errorMessage = `${message}, url: ${url}`
    super(errorMessage)
    this.name = this.constructor.name
    this.code = code
    this.url = url
  }
}

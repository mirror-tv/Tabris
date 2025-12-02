/**
 * Edge Runtime 專用的錯誤處理器
 * 不依賴 @twreporter/errors，因為該庫在 Edge Runtime 中不可用
 */

/**
 * 簡化版錯誤處理器，用於 Edge Runtime（如 middleware）
 */
export const createEdgeErrorLogger = (
  errorMessage: string,
  traceObject?: Record<string, unknown> | undefined
) => {
  return (error: unknown) => {
    const errorInfo = {
      severity: 'ERROR',
      message: errorMessage,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
      ...(traceObject ?? {}),
    }
    console.error(JSON.stringify(errorInfo))
  }
}


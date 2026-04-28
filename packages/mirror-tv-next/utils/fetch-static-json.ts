import fs from 'fs/promises'
import { STATIC_BASE_URL } from '~/constants/endpoint-config'
import { GLOBAL_CACHE_SETTING } from '~/constants/environment-variables'
import { isServer } from '~/utils/common'
import { appendTimestampForCache } from '~/utils/url'

type FetchStaticJsonOptions = {
  pathPrefix?: '/json' | '/files/json' | '/files/documents'
  cacheBust?: boolean
}

/**
 * Fetch static JSON from local GCS FUSE mount if on server, otherwise fallback to HTTP fetch.
 *
 * @param filename - The JSON filename to fetch
 */
export async function fetchStaticJson<T = unknown>(
  filename: string,
  options: FetchStaticJsonOptions = {}
): Promise<T> {
  const { pathPrefix = '/json', cacheBust = false } = options
  const GCS_FUSE_MOUNT_DIR = process.env.GCS_FUSE_MOUNT_DIR

  // 1. Try reading from local file system only when mount dir is explicitly set (e.g. in production with GCS FUSE)
  if (isServer() && GCS_FUSE_MOUNT_DIR) {
    // Structure: [mount_dir]/[prefix]/[filename]
    const filePath = `${GCS_FUSE_MOUNT_DIR}${pathPrefix}/${filename}`

    try {
      const content = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(content) as T
    } catch (err) {
      const isError = err instanceof Error;
  
      // 透過轉型取得 Node.js 專有的屬性
      // 我們先將其視為 any 或特定的 NodeJS.ErrnoException
      const nodeErr = err as NodeJS.ErrnoException;
      // Fallback to fetch if file not found or unreadable
      console.warn(
        JSON.stringify({
          severity: 'WARNING',
          message:
            '[fetchStaticJson] Local read failed, falling back to HTTP fetch',
          filename,
          pathPrefix,
          filePath,
          mountDir: GCS_FUSE_MOUNT_DIR,
          cacheBust,
          error:
            err instanceof Error
              ? {
            name: nodeErr.name, 
            message: nodeErr.message, 
            code: nodeErr.code,       // 現在認得到了
            errno: nodeErr.errno,     // 系統錯誤編號
            syscall: nodeErr.syscall, // 發生錯誤的系統呼叫
              }
              : String(err),
        })
      )
    }
  }

  // 2. Fallback to HTTP fetch
  const url = cacheBust
    ? appendTimestampForCache(`${STATIC_BASE_URL}${pathPrefix}/${filename}`)
    : `${STATIC_BASE_URL}${pathPrefix}/${filename}`
  const res = await fetch(url, {
    next: { revalidate: GLOBAL_CACHE_SETTING },
  })

  if (!res.ok) {
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: '[fetchStaticJson] HTTP fallback failed',
        filename,
        pathPrefix,
        mountDir: GCS_FUSE_MOUNT_DIR ?? null,
        usedLocalMount: Boolean(GCS_FUSE_MOUNT_DIR),
        usedHttpFallback: true,
        cacheBust,
        url,
        status: res.status,
        statusText: res.statusText,
        revalidate: GLOBAL_CACHE_SETTING,
      })
    )
    throw new Error(
      `[fetchStaticJson] Failed to fetch ${url}: ${res.status} ${res.statusText}`
    )
  }

  return res.json() as Promise<T>
}

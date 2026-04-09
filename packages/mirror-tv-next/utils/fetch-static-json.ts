import fs from 'fs/promises'
import { STATIC_BASE_URL } from '~/constants/endpoint-config'
import { GLOBAL_CACHE_SETTING } from '~/constants/environment-variables'
import { isServer } from '~/utils/common'

/**
 * Fetch static JSON from local GCS FUSE mount if on server, otherwise fallback to HTTP fetch.
 *
 * @param filename - The JSON filename to fetch
 */
export async function fetchStaticJson<T = unknown>(
  filename: string,
  hasFilePrefix: boolean = false
): Promise<T> {
  const GCS_FUSE_MOUNT_DIR = process.env.GCS_FUSE_MOUNT_DIR
  const pathPrefix = hasFilePrefix ? '/files/json' : '/json'

  // 1. Try reading from local file system only when mount dir is explicitly set (e.g. in production with GCS FUSE)
  if (isServer() && GCS_FUSE_MOUNT_DIR) {
    try {
      // Structure: [mount_dir]/[prefix]/[filename]
      const filePath = `${GCS_FUSE_MOUNT_DIR}${pathPrefix}/${filename}`
      const content = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(content) as T
    } catch (err) {
      // Fallback to fetch if file not found or unreadable
      console.warn(
        `[fetchStaticJson] Local read failed for ${filename}, falling back to HTTP fetch.`,
        err
      )
    }
  }

  // 2. Fallback to HTTP fetch
  const url = `${STATIC_BASE_URL}${pathPrefix}/${filename}`
  const res = await fetch(url, {
    next: { revalidate: GLOBAL_CACHE_SETTING },
  })

  if (!res.ok) {
    throw new Error(
      `[fetchStaticJson] Failed to fetch ${url}: ${res.status} ${res.statusText}`
    )
  }

  return res.json() as Promise<T>
}

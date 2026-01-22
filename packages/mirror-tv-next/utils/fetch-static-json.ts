import fs from 'fs/promises'
import { isServer } from '~/utils/common'
import {
  GLOBAL_CACHE_SETTING,
  JSON_BASE_URL,
} from '~/constants/environment-variables'

/**
 * Fetch static JSON from local GCS FUSE mount if on server, otherwise fallback to HTTP fetch.
 *
 * @param filename - The JSON filename to fetch
 */
export async function fetchStaticJson<T = unknown>(
  filename: string
): Promise<T> {
  const GCS_FUSE_MOUNT_DIR = process.env.GCS_FUSE_MOUNT_DIR ?? '/statics'

  // 1. Try reading from local file system if on server
  if (isServer()) {
    try {
      // Structure: [mount_dir]/files/json/[filename]
      const filePath = `${GCS_FUSE_MOUNT_DIR}/files/json/${filename}`
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
  const url = `${JSON_BASE_URL}/${filename}`
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

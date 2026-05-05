import fs from 'fs/promises'
import zlib from 'zlib'
import { promisify } from 'util'
import { STATIC_BASE_URL } from '~/constants/endpoint-config'
import { GLOBAL_CACHE_SETTING } from '~/constants/environment-variables'
import { isServer } from '~/utils/common'
import { appendTimestampForCache } from '~/utils/url'

const gunzip = promisify(zlib.gunzip)

// GCS objects uploaded with `Content-Encoding: gzip` are stored as compressed
// bytes; GCS Fuse exposes raw bytes (no transparent decode), so we sniff the
// gzip magic header (RFC 1952) and gunzip when present. The bucket contains a
// mix of gzipped and plain JSON files, so unconditional decompression would
// break the plain ones.
const GZIP_MAGIC_0 = 0x1f
const GZIP_MAGIC_1 = 0x8b

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

    let phase: 'read' | 'gunzip' | 'parse' = 'read'
    let decompressed = false
    try {
      const buffer = await fs.readFile(filePath)
      const isGzip =
        buffer.length >= 2 &&
        buffer[0] === GZIP_MAGIC_0 &&
        buffer[1] === GZIP_MAGIC_1
      let content: string
      if (isGzip) {
        phase = 'gunzip'
        const inflated = await gunzip(buffer)
        decompressed = true
        content = inflated.toString('utf-8')
      } else {
        content = buffer.toString('utf-8')
      }
      phase = 'parse'
      return JSON.parse(content) as T
    } catch (err) {
      const nodeErr = err as NodeJS.ErrnoException
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
          phase,
          decompressed,
          error:
            err instanceof Error
              ? {
                  name: nodeErr.name,
                  message: nodeErr.message,
                  code: nodeErr.code,
                  errno: nodeErr.errno,
                  syscall: nodeErr.syscall,
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

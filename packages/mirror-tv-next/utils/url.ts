function appendTimestampForCache(url: string): string {
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}t=${Math.floor(Date.now() / 1000)}`
}

export { appendTimestampForCache }

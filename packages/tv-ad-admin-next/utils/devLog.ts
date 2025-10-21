import { env } from '@/constants/environment-variables'

export function devLog(value: unknown, name?: string): void {
  if (!['dev', 'local'].includes(env.ENV)) return // only runs in vite dev/local mode

  const type = typeof value
  const date = new Date()
  const [h, m, s] = [date.getHours(), date.getMinutes(), date.getSeconds()].map(
    (unit) => String(unit).padStart(2, '0')
  )
  const timeStamp = `[${h}:${m}:${s}]`

  let output: string
  if (typeof value === 'function') output = '[Function]'
  else {
    try {
      output = JSON.stringify(value, null, 2)
    } catch {
      output = '[Unserializable value]'
    }
  }

  const Colors = {
    name: 'font-weight:bold;color:#7BC96F',
    value: 'color:white',
    meta: 'color:#94A3B8',
  }

  const isObject = value !== null && typeof value === 'object'
  if (isObject) {
    console.groupCollapsed(
      `%c🔍 ${name} %c| Type: ${type} ${timeStamp}`,
      Colors.name,
      Colors.meta
    )
    console.log(`%c${output}`, Colors.value)
    console.groupEnd()
  } else {
    console.log(
      `%c🔍 ${
        name ? name + ' ==> ' : ''
      }%c${value} %c| Type: ${type} ${timeStamp}`,
      Colors.name,
      Colors.value,
      Colors.meta
    )
  }
}

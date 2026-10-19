import { ELECTION_IFRAME_URL } from '~/constants/environment-variables'
import dayjs from 'dayjs'
import { TV_END_TS, TV_START_TS } from '~/constants/runtime-config'
import styles from './_styles/election-iframe.module.scss'

function isWithinShowPeriod() {
  const start = dayjs(TV_START_TS)
  const end = dayjs(TV_END_TS)
  if (!TV_START_TS || !TV_END_TS || !start.isValid() || !end.isValid()) {
    return false
  }
  const now = dayjs()
  return !now.isBefore(start) && !now.isAfter(end)
}

export default function ElectionIframe() {
  if (!ELECTION_IFRAME_URL || !isWithinShowPeriod()) {
    return null
  }

  return (
    <div className={styles.wrapper}>
      <iframe
        className={styles.iframe}
        src={ELECTION_IFRAME_URL}
        title="2026 選舉開票"
        scrolling="no"
      />
    </div>
  )
}

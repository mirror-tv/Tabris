import { ELECTION_IFRAME_URL } from '~/constants/environment-variables'
import dayjs from 'dayjs'
import {
  TV_END_TS,
  TV_START_TS,
  TV_TEST_END_TS,
} from '~/constants/runtime-config'
import styles from './_styles/election-iframe.module.scss'

const TAIPEI_ISO_TIMESTAMP_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+08:00$/

/**
 * Only accepts `YYYY-MM-DDTHH:mm:ss+08:00`.
 */
function isTaipeiIsoTimestamp(value: string) {
  return TAIPEI_ISO_TIMESTAMP_REGEX.test(value) && dayjs(value).isValid()
}

function isWithinShowPeriod() {
  if (!isTaipeiIsoTimestamp(TV_START_TS) || !isTaipeiIsoTimestamp(TV_END_TS)) {
    return false
  }
  const now = dayjs()
  return !now.isBefore(dayjs(TV_START_TS)) && !now.isAfter(dayjs(TV_END_TS))
}

function isWithinTestPeriod() {
  if (!isTaipeiIsoTimestamp(TV_TEST_END_TS)) {
    return false
  }
  return dayjs().isBefore(dayjs(TV_TEST_END_TS))
}

export default function ElectionIframe() {
  if (!ELECTION_IFRAME_URL || !isWithinShowPeriod()) {
    return null
  }

  const isElectionTestPeriod = isWithinTestPeriod()

  return (
    <div className={styles.wrapper}>
      <div className={styles.frame}>
        <iframe
          className={styles.iframe}
          src={ELECTION_IFRAME_URL}
          title="2026 選舉開票"
          scrolling="no"
        />
        {isElectionTestPeriod && (
          <span className={styles.testLabel}>測試畫面</span>
        )}
      </div>
    </div>
  )
}

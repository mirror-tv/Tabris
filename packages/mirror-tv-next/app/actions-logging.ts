import { Logging } from '@google-cloud/logging'
import { GCP_PROJECT_ID } from '~/constants/config'
import { ENV } from '~/constants/environment-variables'

export async function logPageView() {
  const logging = new Logging({ projectId: GCP_PROJECT_ID })
  const eventType = 'page-view'
  const logName = `${GCP_PROJECT_ID}-${ENV}-web-${eventType}`
  const log = logging.log(logName)

  const metadata = {
    resource: { type: 'global' },
    severity: 'INFO',
    labels: {
      eventType,
    },
  }

  const entry = log.entry(metadata)

  return log.write(entry)
}

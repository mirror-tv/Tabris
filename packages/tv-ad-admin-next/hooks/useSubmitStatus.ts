// hooks/useSubmitStatus.ts
import { useState } from 'react'

import type { SubmitStatus } from '@/types'

export function useSubmitStatus() {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')

  function resetStatus() {
    setSubmitStatus('idle')
  }

  return { submitStatus, setSubmitStatus, resetStatus }
}

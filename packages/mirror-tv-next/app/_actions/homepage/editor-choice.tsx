'use server'
import errors from '@twreporter/errors'
import { getClient } from '~/apollo-client'
import {
  EditorChoices,
  fetchEditorChoices,
} from '~/graphql/query/editor-choices'
import { createDataFetchingChain } from '~/utils/fetch-function'
import { URL_STATIC_EDITOR_CHOICES } from '~/constants/environment-variables'

function isValidEditorChoicesResponse(
  data: unknown
): data is { allEditorChoices: EditorChoices[] } {
  if (!data || typeof data !== 'object') return false

  const obj = data as Record<string, unknown>
  if (!Array.isArray(obj.allEditorChoices)) return false

  return obj.allEditorChoices.every((item) => {
    if (!item || typeof item !== 'object') return false
    const choice = (item as Record<string, unknown>).choice
    if (!choice || typeof choice !== 'object') return false

    const choiceObj = choice as Record<string, unknown>
    return (
      typeof choiceObj.name === 'string' &&
      typeof choiceObj.slug === 'string' &&
      choiceObj.heroImage &&
      typeof choiceObj.heroImage === 'object'
    )
  })
}

async function getEditorChoices(): Promise<{
  data: { allEditorChoices: EditorChoices[] }
}> {
  const errorLogger = (err: unknown) => {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching editor choices in homepage'
    )
    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(annotatingError, {
          withStack: false,
          withPayload: true,
        }),
      })
    )
  }

  const data = await createDataFetchingChain<{
    allEditorChoices: EditorChoices[]
  }>(
    errorLogger,
    { allEditorChoices: [] },
    async () => {
      const resp = await fetch(URL_STATIC_EDITOR_CHOICES)
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`)
      }
      const jsonData = await resp.json()

      if (!isValidEditorChoicesResponse(jsonData)) {
        throw new Error('Invalid data format from static endpoint')
      }

      return jsonData
    },
    async () => {
      const client = getClient()
      const { data } = await client.query<{
        allEditorChoices: EditorChoices[]
      }>({
        query: fetchEditorChoices,
      })
      return data
    }
  )

  return { data }
}

export { getEditorChoices }

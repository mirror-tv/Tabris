'use server'
import errors from '@twreporter/errors'
import { getClient } from '~/apollo-client'
import {
  EditorChoices,
  fetchEditorChoices,
} from '~/graphql/query/editor-choices'

async function getEditorChoices(): Promise<{
  data: { allEditorChoices: EditorChoices[] }
}> {
  const client = getClient()
  try {
    const { data } = await client.query<{
      allEditorChoices: EditorChoices[]
    }>({
      query: fetchEditorChoices,
    })
    return { data }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      `Error occurs while fetching editor choices in homepage`
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
  return { data: { allEditorChoices: [] } }
}

export { getEditorChoices }

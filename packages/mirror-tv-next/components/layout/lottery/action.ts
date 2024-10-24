'use server'
import axios from 'axios'
import { SITE_URL, ENV } from '~/constants/environment-variables'

export async function submitFormAction(data: (string | Date)[][]) {
  const endpoint = ENV === 'prod' ? '/api/sheets' : `${SITE_URL}/api/sheets`
  try {
    const response = await axios.post(endpoint, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (response.status !== 200) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }
    return response.data
  } catch (error) {
    // @ts-expect-error Property 'stack' is not guaranteed to exist on 'error'
    console.log(JSON.stringify({ severity: 'ERROR', message: error.stack }))
    return { status: error, error }
  }
}

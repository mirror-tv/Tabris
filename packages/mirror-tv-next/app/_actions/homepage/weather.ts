'use server'

import { createErrorLogger } from '~/utils/log'
import { GLOBAL_CACHE_SETTING } from '~/constants/environment-variables'
import { type CityAndWeather } from '~/components/homepage/weather-main'

const URL_STATIC_WEATHER = `https://www.mirrordaily.news/weather.json`

export const fetchWeather = async (): Promise<CityAndWeather | undefined> => {
  const errorLogger = createErrorLogger('Error occurs while fetching weather')

  try {
    const resp = await fetch(URL_STATIC_WEATHER, {
      next: { revalidate: GLOBAL_CACHE_SETTING },
    })

    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`)
    }

    const rawWeatherData = await resp.json()
    const data = JSON.parse(JSON.stringify(rawWeatherData))
    // Ensure data is parsed and not referencing the original object
    // https://github.com/vercel/next.js/issues/47447

    return data as CityAndWeather
  } catch (e) {
    errorLogger(e)
    return undefined
  }
}

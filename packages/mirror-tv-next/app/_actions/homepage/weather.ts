'use server'

import { createErrorLogger } from '~/utils/log'
import { type CityAndWeather } from '~/components/homepage/weather-main'
import { fetchStaticJson } from '~/utils/fetch-static-json'

export const fetchWeather = async (): Promise<CityAndWeather | undefined> => {
  const errorLogger = createErrorLogger('Error occurs while fetching weather')

  try {
    const rawWeatherData = await fetchStaticJson('weather.json')

    const data = JSON.parse(JSON.stringify(rawWeatherData))
    // Ensure data is parsed and not referencing the original object
    // https://github.com/vercel/next.js/issues/47447

    return data as CityAndWeather
  } catch (e) {
    errorLogger(e)
    return undefined
  }
}

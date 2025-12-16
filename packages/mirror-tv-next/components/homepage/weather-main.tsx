'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import styles from './_styles/weather-main.module.scss'
import { fetchWeather } from '~/app/_actions/homepage/weather'
import ArrowUpIcon from '~/public/icons/weather/arrow-up.svg'

const weatherToImage = {
  晴: '/icons/weather/sunny.svg',
  多雲: '/icons/weather/cloudy.svg',
  陰: '/icons/weather/overcast.svg',
  陣雨: '/icons/weather/shower.svg',
  雷陣雨: '/icons/weather/thunderstorm.svg',
  雨: '/icons/weather/rain.svg',
  雪: '/icons/weather/snow.svg',
  未知: '/icons/weather/unknown.svg',
} as const

export type CityAndWeather = {
  [city: string]: {
    weather: string
    max_temp: number
    min_temp: number
  }
}

export default function WeatherMain() {
  const [weatherData, setWeatherData] = useState<CityAndWeather | undefined>(
    undefined
  )
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState<string>('')

  useEffect(() => {
    const loadWeatherData = async () => {
      const data = await fetchWeather()
      console.log({ data })
      if (data) {
        setWeatherData(data)
        const cities = Object.keys(data)
        setSelectedCity(
          cities.includes('臺北市') ? '臺北市' : cities?.[0] || ''
        )
      }
    }
    loadWeatherData()
  }, [])

  if (!weatherData) return null

  const cities = Object.keys(weatherData)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    setIsDropdownOpen(false)
  }

  const info = weatherData[selectedCity]
  if (!info) return null

  return (
    <>
      <div className={styles.container}>
        <div className={styles.weatherBar}>
          <p className={styles.label}>今日天氣</p>
          <div className={styles.citySelector}>
            <button
              className={`${styles.cityButton} ${
                isDropdownOpen ? styles.isOpen : ''
              }`}
              onClick={toggleDropdown}
            >
              <p>{selectedCity}</p>
              <ArrowUpIcon
                className={`${styles.arrow} ${styles.arrowUp} ${
                  isDropdownOpen ? styles.rotate180 : ''
                }`}
              />
            </button>
            {isDropdownOpen && (
              <ul className={styles.dropdown}>
                {cities.map((city) => (
                  <li
                    className={styles.dropdownItem}
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    data-gtm="weather-city-selection"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Image
            src={
              weatherToImage[info.weather as keyof typeof weatherToImage] ||
              '/icons/weather/unknown.svg'
            }
            width={18}
            height={18}
            alt="天氣圖示"
            className={styles.weatherIcon}
          />
          <p className={styles.maxTemp}>{info['max_temp']}º</p>
          <p className={styles.minTemp}>{info['min_temp']}º</p>
        </div>
      </div>
      <p className={styles.source}>提供機關／交通部中央氣象署</p>
    </>
  )
}

'use client'
import styles from './_styles/ui-podcast-item.module.scss'
import { Podcast } from '~/types/common'
import { MouseEventHandler, useState } from 'react'
import dayjs from 'dayjs'

type UiPodcastItemProps = {
  item: Podcast
  isPlaying: boolean
  handleOnClick: MouseEventHandler<HTMLLIElement>
}

export default function UiPodcastItem({
  item,
  isPlaying,
  handleOnClick,
}: UiPodcastItemProps) {
  const [isHover, setIsHover] = useState<boolean>(false)
  const publishDate = dayjs(item?.published).format('YYYY/MM/DD')
  return (
    <li
      className={`GTM-podcasts-item ${styles.item} ${
        isHover && styles.isHover
      } ${isHover && `${styles.isPlaying} GTM-isPlaying`}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={handleOnClick}
    >
      <div className={styles.info}>
        <span className={styles.date}>{publishDate}</span>
        <h4 className={styles.title}>{item.title}</h4>
      </div>
      <div className={styles.play}>
        <button className={styles.controlBtn}>
          {!isPlaying && !isHover ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 0C5.38321 0 0 5.38321 0 12C0 18.6168 5.38321 24 12 24C18.6168 24 24 18.6168 24 12C24 5.38321 18.6168 0 12 0ZM12 22.857C6.01323 22.857 1.14301 17.9868 1.14301 12C1.14301 6.01323 6.01323 1.14301 12 1.14301C17.9868 1.14301 22.857 6.01323 22.857 12C22.857 17.9868 17.9868 22.857 12 22.857ZM17.5526 11.5051L9.3048 6.74331C9.12796 6.64123 8.91028 6.64123 8.73344 6.74331C8.5566 6.84539 8.44762 7.03403 8.44762 7.23819V16.7618C8.44762 16.966 8.5566 17.1546 8.73344 17.2567C8.82172 17.3079 8.92035 17.3332 9.01927 17.3332C9.11789 17.3332 9.21652 17.3076 9.30509 17.2567L17.5529 12.4949C17.7297 12.3928 17.8387 12.2042 17.8387 12C17.8387 11.7958 17.7294 11.6072 17.5526 11.5051ZM9.59034 15.7721V8.22793L16.124 12L9.59034 15.7721Z"
                fill="#004EBC"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <g clipPath="url(#clip0_8716_1351)">
                <path
                  d="M24 12C24 18.63 18.63 24 12 24C5.37 24 0 18.63 0 12C0 5.37 5.37 0 12 0C18.63 0 24 5.37 24 12ZM17.55 11.51L9.3 6.75C9.12 6.65 8.91 6.65 8.73 6.75C8.55 6.85 8.44 7.04 8.44 7.24V16.76C8.44 16.96 8.55 17.15 8.73 17.25C8.82 17.3 8.92 17.33 9.02 17.33C9.12 17.33 9.22 17.3 9.31 17.25L17.56 12.49C17.74 12.39 17.85 12.2 17.85 12C17.85 11.8 17.74 11.61 17.56 11.51H17.55Z"
                  fill="#004EBC"
                />
              </g>
              <defs>
                <clipPath id="clip0_8716_1351">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          )}
        </button>
        <span className={styles.duration}>{'0' + item.duration}</span>
      </div>
    </li>
  )
}

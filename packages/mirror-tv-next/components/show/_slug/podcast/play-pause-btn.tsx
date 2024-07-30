'use client'
import React, { useState } from 'react'
import styles from './_styles/play-pause-btn.module.scss'

interface PlayPauseButtonProps {
  isPlaying: boolean
  togglePlayPause: () => void
  hasError: boolean
}

export default function PlayPauseButton({
  isPlaying,
  togglePlayPause,
  hasError,
}: PlayPauseButtonProps) {
  const [active, setActive] = useState(false)

  const handleClick = () => {
    if (hasError) return
    togglePlayPause()
    setActive(!active)
  }

  return (
    <div
      className={`${styles.togglePlayBtn} player__control `}
      onClick={handleClick}
    >
      <span
        className={`${isPlaying ? styles.pause : styles.play} ${
          hasError ? (isPlaying ? styles.pauseErr : styles.playErr) : ''
        }`}
      />
    </div>
  )
}

'use client'
import React, { useState } from 'react'
import styles from './_styles/play-pause-btn.module.scss'

interface PlayPauseButtonProps {
  isPlaying: boolean
  togglePlayPause: () => void
  hasError: boolean
  color?: string
}

export default function PlayPauseButton({
  isPlaying,
  togglePlayPause,
  hasError,
  color = 'white',
}: PlayPauseButtonProps) {
  const [active, setActive] = useState(false)

  const handleClick = () => {
    if (hasError) return
    togglePlayPause()
    setActive(!active)
  }

  return (
    <div
      className={`${styles.togglePlayBtn} GTM-player-control `}
      onClick={handleClick}
    >
      <span
        className={`${isPlaying ? styles.pause : styles.play} ${
          hasError ? (isPlaying ? styles.pauseErr : styles.playErr) : ''
        }`}
        style={{
          borderLeft: isPlaying ? `4px solid ${color}` : `12px solid ${color}`,
          borderRight: isPlaying ? `4px solid ${color}` : 'none',
        }}
        key={isPlaying ? 'play' : 'pause'}
      />
    </div>
  )
}

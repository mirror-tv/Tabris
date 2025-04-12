'use client'

import { useRef, useState, useEffect } from 'react'
import styles from './_styles/audio-player.module.scss'
import PlayPauseButton from '~/components/show/_slug/podcast/play-pause-btn'

interface AudioPlayerProps {
  src: string
  title?: string
}

export default function AudioPlayer({
  src,
  title = 'default audio',
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    let lastUpdateTime = 0
    const handleTimeUpdate = () => {
      const currentTime = Date.now()
      if (currentTime - lastUpdateTime >= 500) {
        lastUpdateTime = currentTime
        setCurrentTime(audio.currentTime)
      }
    }

    const handleDurationChange = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    handleDurationChange()
    handleEnded()

    setCurrentTime(audio.currentTime)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [audioRef])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return

    const rect = progressRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = x / rect.width
    const newTime = percent * duration

    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  return (
    <div className={styles['audio-player']}>
      <div className={styles['audio-player-title']}>{title}</div>

      <div className={styles['progress-bar-container']}>
        <div
          className={styles['play-button']}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <PlayPauseButton
            isPlaying={isPlaying}
            togglePlayPause={togglePlay}
            hasError={false}
            color="#FFCC01"
          />
        </div>
        <div
          className={styles['progress-bar']}
          ref={progressRef}
          onClick={handleProgressClick}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={(currentTime / duration) * 100}
        >
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            className={`${styles['progress']} progress`}
            style={{
              background: `linear-gradient(to right, #014db8 0%, #014db8 ${
                (currentTime / duration) * 100
              }%, #979797 ${(currentTime / duration) * 100}%, #979797 100%)`,
            }}
          />
          <div className={styles['time']}>
            <p>{formatTime(currentTime)}</p>
            <p> {duration ? formatTime(duration - currentTime) : '00:00'}</p>
          </div>
        </div>
        <audio ref={audioRef} src={src} preload="metadata" />
      </div>
    </div>
  )
}

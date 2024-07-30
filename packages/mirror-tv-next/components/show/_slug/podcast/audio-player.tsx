'use client'
import { useEffect, useRef, useState, ChangeEvent, useMemo } from 'react'
import styles from './_styles/audio-player.module.scss'
import PlayPauseButton from './play-pause-btn'
import { Podcast } from '~/types/common'
import AudioSound from '~/public/icons/audio-sound.svg'
import AudioMuteDash from '~/public/icons/audio-muted.svg'

type AudioPlayerProps = {
  listeningPodcast: Podcast | null
}

const PLAYBACK_SPEEDS = {
  NORMAL: 1,
  FAST: 1.5,
  FASTER: 2,
} as const
type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[keyof typeof PLAYBACK_SPEEDS]

export default function AudioPlayer({ listeningPodcast }: AudioPlayerProps) {
  const audioURL = listeningPodcast?.enclosures[0].url ?? ''
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState<PlaybackSpeed>(PLAYBACK_SPEEDS.NORMAL)
  const [duration, setDuration] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)

  const [isMuted, setIsMuted] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [volume, setVolume] = useState(100)
  const [audioLoadError, setAudioLoadError] = useState(false)

  const formateTime = (second: number): string => {
    const minutes = Math.floor(second / 60)
    const seconds = second % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const formattedDuration = useMemo(() => {
    return formateTime(duration)
  }, [duration])

  const formattedCurrentTime = useMemo(() => {
    return formateTime(currentTime)
  }, [currentTime])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleAudioError = () => {
      setAudioLoadError(true)
    }

    const updateTime = () => {
      if (!audio) return
      const currentSeconds = Math.floor(audio.currentTime)
      setCurrentTime(currentSeconds)
    }

    const updateDuration = () => {
      if (!audio) return
      setDuration(Math.floor(audio.duration))
    }

    setCurrentTime(0)
    setDuration(0)
    setSpeed(PLAYBACK_SPEEDS.NORMAL)
    setIsPlaying(true)
    setShowVolumeSlider(false)
    setIsMuted(false)
    setAudioLoadError(false)

    const seekSlider = document.querySelector(
      'input[type="range"]'
    ) as HTMLInputElement | null
    if (seekSlider) {
      seekSlider.max = String(audio.duration)
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('error', handleAudioError)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('error', handleAudioError)
    }
  }, [audioURL])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const updateSpeed = () => {
    if (audioLoadError) return
    const audio = audioRef.current
    if (!audio) return
    switch (speed) {
      case PLAYBACK_SPEEDS.NORMAL:
        audio.playbackRate = PLAYBACK_SPEEDS.FAST
        setSpeed(PLAYBACK_SPEEDS.FAST)
        break
      case PLAYBACK_SPEEDS.FAST:
        audio.playbackRate = PLAYBACK_SPEEDS.FASTER
        setSpeed(PLAYBACK_SPEEDS.FASTER)
        break
      default:
        audio.playbackRate = PLAYBACK_SPEEDS.NORMAL
        setSpeed(PLAYBACK_SPEEDS.NORMAL)
        break
    }
  }

  const onSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const newTime = parseInt(e.target.value, 10)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value, 10)
    const audio = audioRef.current
    if (!audio) return
    audio.volume = newVolume / 100
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleVolumeClicked = () => {
    const audio = audioRef.current
    if (!audio) return
    let newVolume = volume

    if (isMuted) {
      setVolume(newVolume)
      audio.volume = newVolume / 100
    } else {
      newVolume = 0
      audio.volume = 0
    }

    setIsMuted(!isMuted)
  }

  return (
    <div className={styles.wrapper}>
      {listeningPodcast && (
        <>
          {audioLoadError ? (
            <div className={styles.error}>
              這集節目暫時無法播放，請重新整理頁面或檢查您的網路環境
            </div>
          ) : (
            <div className={styles.marquee}>
              <div className={styles.marqueeContent}>
                {listeningPodcast.title}
              </div>
            </div>
          )}

          <div className={styles.container} key={audioURL}>
            <audio ref={audioRef} src={audioURL} autoPlay></audio>
            <div
              className={`${styles.control} ${
                audioLoadError ? styles.hasError : ''
              }`}
            >
              <PlayPauseButton
                isPlaying={isPlaying}
                togglePlayPause={togglePlayPause}
                hasError={audioLoadError}
              />
              <span>{formattedCurrentTime}</span>
              &nbsp;/&nbsp;
              <span>{formattedDuration}</span>
              <div
                className={`${styles.slidersWrapper} ${
                  audioLoadError ? styles.hasError : ''
                }`}
              >
                <input
                  className={`${styles.seekSlider} ${
                    audioLoadError ? styles.seekHasError : ''
                  }`}
                  type="range"
                  min="0"
                  step="1"
                  value={currentTime}
                  onChange={onSeek}
                  max={duration}
                  style={
                    {
                      '--current-time': audioLoadError
                        ? '0%'
                        : `${(currentTime / duration) * 100}%`,
                    } as React.CSSProperties
                  }
                />
                <div
                  className={`${styles.volume} ${
                    audioLoadError ? styles.hasError : ''
                  }`}
                  onMouseEnter={() => setShowVolumeSlider(!audioLoadError)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <button
                    className={`${styles.icons} ${
                      audioLoadError ? styles.hasError : ''
                    }`}
                    onClick={handleVolumeClicked}
                  >
                    <AudioSound />
                    {isMuted && <AudioMuteDash />}
                  </button>

                  {showVolumeSlider && (
                    <div className={styles.volumeSliderContainer}>
                      <input
                        className={styles.volumeSlider}
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={volume}
                        onChange={handleVolumeChange}
                        style={
                          {
                            '--current-volume': `${volume}%`,
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
              <button
                className={`${styles.speedBtn}${
                  audioLoadError ? styles.hasError : ''
                }`}
                onClick={updateSpeed}
              >
                Ｘ{speed}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

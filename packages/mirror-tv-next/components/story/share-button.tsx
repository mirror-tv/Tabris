'use client'

import { useEffect, useState } from 'react'
import styles from './_styles/share-button.module.scss'

type ShareType = 'facebook' | 'line' | 'twitter' | 'copy'

interface ShareButtonProps {
  type: ShareType
  url?: string
  className?: string
}

const ShareButton = ({ type, url, className }: ShareButtonProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const shareUrl = url || (isMounted ? window.location.href : '')

  const getShareConfig = () => {
    switch (type) {
      case 'facebook':
        return {
          href: `https://www.facebook.com/share.php?u=${encodeURIComponent(
            shareUrl
          )}`,
          icon: '/images/social-media/fb-round.svg',
          alt: 'share to facebook',
          isLink: true,
        }
      case 'line':
        return {
          href: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
            shareUrl
          )}`,
          icon: '/images/social-media/line-word.svg',
          alt: 'share to line',
          isLink: true,
        }
      case 'twitter':
        return {
          href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareUrl
          )}`,
          icon: '/images/social-media/twitter-round.svg',
          alt: 'share to twitter',
          isLink: true,
        }
      case 'copy':
        return {
          href: '#',
          icon: '/icons/icon-x.svg',
          alt: 'copy link',
          isLink: false,
        }
      default:
        return {
          href: '#',
          icon: '/icons/share-link.svg',
          alt: 'share',
          isLink: true,
        }
    }
  }

  const handleCopyClick = (e: React.MouseEvent) => {
    if (type === 'copy') {
      e.preventDefault()
      /*
       * Since element.focus({preventScroll: boolean})
       * not work in safari, we memory the depth when user clicked
       * doc: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus
       */
      if (typeof window !== 'undefined') {
        const depth = window.pageYOffset
        const inputc = document.body?.appendChild(
          document.createElement('input')
        )
        inputc.value = shareUrl
        // inputc.focus({ preventScroll: true })
        inputc.select()
        document.execCommand('copy')
        inputc.parentNode?.removeChild(inputc)
        window.alert('連結已複製')
        window.scrollTo(0, depth)
      }
    }
  }

  const config = getShareConfig()

  if (config.isLink) {
    return (
      <a
        href={config.href}
        className={`${styles.share} ${className || ''}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>
          <img src={config.icon} alt={config.alt} loading="lazy" />
        </span>
      </a>
    )
  }

  return (
    <button
      type="button"
      className={`${styles.share} ${className || ''}`}
      onClick={handleCopyClick}
    >
      <span>
        <img src={config.icon} alt={config.alt} loading="lazy" />
      </span>
    </button>
  )
}

export default ShareButton

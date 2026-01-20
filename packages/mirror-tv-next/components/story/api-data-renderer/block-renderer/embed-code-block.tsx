'use client'
import { useEffect, useRef } from 'react'
import { type ApiDataBlockBase, ApiDataBlockType } from './type'
import styles from './_styles/embed-code-block.module.scss'

type ContentEmbedCode = {
  caption: string
  scripts: unknown[]
  embeddedCode: string
  embeddedCodeWithoutScript: string
}

export interface ApiDataEmbedCode extends ApiDataBlockBase {
  type: ApiDataBlockType.EmbedCode
  content: [ContentEmbedCode]
  alignment: 'center'
}

// Helper function to extract Facebook URL from embedded code
function extractFacebookUrl(embeddedCode: string): string {
  const urlMatch = embeddedCode.match(/href=([^&"\s]+)/i)
  if (urlMatch) {
    return decodeURIComponent(urlMatch[1])
  }

  const srcMatch = embeddedCode.match(/src=["']([^"']*facebook[^"']*)["']/i)
  if (srcMatch) {
    return srcMatch[1]
  }

  return 'https://www.facebook.com/'
}

export default function EmbedCodeBlock({ data }: { data: ApiDataEmbedCode }) {
  const { caption, embeddedCode } = data.content[0]
  const embedRef = useRef<HTMLDivElement>(null)
  const run = useRef(false)

  const isScrollVideo = caption === 'reporter-scroll-video'
  const hasPdfFile = embeddedCode.includes('.pdf')
  const showCaption = caption && !isScrollVideo && !hasPdfFile

  useEffect(() => {
    if (embedRef.current && !run.current) {
      const node = embedRef.current
      const fragment = document.createDocumentFragment()

      // `embeddedCode` is a string, which may includes
      // multiple '<script>' tags and other html tags.
      // For executing '<script>' tags on the browser,
      // we need to extract '<script>' tags from `embeddedCode` string first.
      //
      // The approach we have here is to parse html string into elements,
      // and we could use DOM element built-in functions,
      // such as `querySelectorAll` method, to query '<script>' elements,
      // and other non '<script>' elements.
      // 檢測是否包含 YouTube iframe
      const hasYouTubeIframe =
        embeddedCode.includes('youtube.com/embed') ||
        embeddedCode.includes('youtu.be') ||
        embeddedCode.includes('youtube.com/watch')

      // 檢測是否包含 Facebook embed
      const hasFacebookEmbed =
        embeddedCode.includes('facebook.com/plugins') ||
        embeddedCode.includes('facebook.com/') ||
        embeddedCode.includes('fb.com/')

      // 如果是 YouTube iframe，移除寬高屬性
      let processedEmbeddedCode = embeddedCode
      if (hasYouTubeIframe) {
        // 移除 width 和 height 屬性
        processedEmbeddedCode = embeddedCode
          .replace(/width=["'][^"']*["']/g, '')
          .replace(/height=["'][^"']*["']/g, '')
          .replace(/\s+/g, ' ') // 清理多餘的空格
          .trim()
      }

      // 如果是 Facebook embed，強制移除高度限制
      if (hasFacebookEmbed) {
        // 強制移除 Facebook iframe 的所有尺寸相關屬性
        processedEmbeddedCode = processedEmbeddedCode
          .replace(/width=["'][^"']*["']/g, '')
          .replace(/height=["'][^"']*["']/g, '')
          .replace(/style="[^"]*width[^"]*"/g, '')
          .replace(/style="[^"]*height[^"]*"/g, '')
          .replace(/style="[^"]*overflow[^"]*"/g, '')
          .replace(/\s+/g, ' ')
          .trim()

        // 為 Facebook iframe 添加錯誤處理和 Safari 特殊處理
        processedEmbeddedCode = processedEmbeddedCode.replace(
          /<iframe([^>]*src=["'][^"']*facebook[^"']*["'][^>]*)>/gi,
          (match, attributes) => {
            const result = `<iframe${attributes} style="width: 100% !important; height: 474px !important;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"></iframe><div class="${
              styles.facebookFallback
            }" style="display:none;"><p>此 Facebook 內容無法在此瀏覽器中顯示</p><p>請點擊 <a href="${extractFacebookUrl(
              embeddedCode
            )}" target="_blank" rel="noopener">這裡</a> 前往 Facebook 查看</p></div>`
            return result
          }
        )
      }

      if (hasPdfFile) {
        processedEmbeddedCode = `<a href="${embeddedCode}" target="_blank" rel="noopener" >${caption}</a>`
      }

      const parser = new DOMParser()
      const ele = parser.parseFromString(
        `<div id="draft-embed">${processedEmbeddedCode}</div>`,
        'text/html'
      )
      const scripts = ele.querySelectorAll('script')
      const nonScripts = ele.querySelectorAll('div#draft-embed > :not(script)')

      nonScripts.forEach((ele) => {
        fragment.appendChild(ele)
      })

      scripts.forEach((s) => {
        const scriptEle = document.createElement('script')
        const attrs = s.attributes
        for (let i = 0; i < attrs.length; i++) {
          scriptEle.setAttribute(attrs[i].name, attrs[i].value)
        }
        scriptEle.text = s.text || ''
        fragment.appendChild(scriptEle)
      })

      node.appendChild(fragment)

      // 如果包含 YouTube iframe，加上 youtube className
      if (hasYouTubeIframe) {
        node.classList.add(styles.youtube)
      }

      // 如果包含 Facebook embed，加上 facebook className
      if (hasFacebookEmbed) {
        node.classList.add(styles.facebook)
      }

      run.current = true
    }
  }, [embeddedCode])

  return (
    <section className={styles.container}>
      <div
        className={`embed ${isScrollVideo ? 'top-layer' : ''}`}
        ref={embedRef}
      ></div>
      {showCaption && <div className="caption">{caption}</div>}
    </section>
  )
}

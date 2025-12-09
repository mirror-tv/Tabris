function convertToAmpFacebook(embeddedCode: string): string {
  const facebookRegex = /facebook.com\/plugins\/post\.php/i
  if (!facebookRegex.test(embeddedCode)) return embeddedCode

  const urlRegex =
    /(?:https?:\/\/)?(?:www\.)?facebook\.com\/plugins\/post\.php\?href=([^&"\s]+)/g
  const widthRegex = /width="([^"]+)"/
  const heightRegex = /height="([^"]+)"/
  const urlMatch = urlRegex.exec(embeddedCode)
  const widthMatch = widthRegex.exec(embeddedCode)
  const heightMatch = heightRegex.exec(embeddedCode)

  if (urlMatch && widthMatch && heightMatch) {
    const url = decodeURIComponent(urlMatch[1])
    const width = widthMatch[1]
    const height = heightMatch[1]

    const ampFacebookCode = `<amp-facebook
      width="${width}"
      height="${height}"
      layout="responsive"
      data-href="${url}"
    ></amp-facebook>`

    return ampFacebookCode
  } else {
    return 'Invalid Facebook embedded code'
  }
}

export function convertEmbeddedToAmp(
  embeddedCode: string,
  currentUrl?: string
): string {
  // Use regex to replace Instagram embedded code with <amp-instagram>
  const igEmbedRegex =
    /<blockquote class="instagram-media"[^>]* data-instgrm-permalink="([^"]+)"[^>]*>[\s\S]*?<\/blockquote>/g
  const ampInstagramCode = embeddedCode.replace(
    igEmbedRegex,
    (igEmbedMatch: string, permalink: string) => {
      const hasCaptioned = igEmbedMatch.includes('data-instgrm-captioned')
      // Extract shortcode from the permalink
      const shortcodeMatch = permalink.match(/\/p\/([^/?]+)/)
      if (shortcodeMatch) {
        const shortcode = shortcodeMatch[1]
        return `<amp-instagram width="1" height="1" data-shortcode="${shortcode}" ${
          hasCaptioned ? 'data-captioned' : ''
        } layout="responsive"></amp-instagram>`
      }
      // Keep it as-is if unable to extract the shortcode
      return igEmbedMatch
    }
  )

  const ampFacebook = convertToAmpFacebook(ampInstagramCode)

  // Use regex to match Twitter embedded code
  const twitterRegex =
    /<blockquote[^>]* class="twitter-tweet"[^>]*>[\s\S]*?<\/blockquote>/g
  const ampTwitterCode = ampFacebook.replace(
    twitterRegex,
    (twitterMatch: string) => {
      // Use regex to extract the value of the data-tweet-id attribute
      const tweetIdMatch = twitterMatch.match(
        /twitter\.com\/[^/]+\/status\/(\d+)/i
      )
      if (tweetIdMatch && tweetIdMatch[1]) {
        const tweetId = tweetIdMatch[1]
        if (tweetIdMatch && tweetId) {
          // Replace with <amp-twitter> tag
          return `<amp-twitter width="375" height="472" data-tweetid="${tweetId}"></amp-twitter>`
        }
      }
      // Keep it as-is if unable to extract the tweet ID
      return twitterMatch
    }
  )

  // Use regex to replace <script> tags with <amp-script>
  const scriptRegex = /<script([^>]*)><\/script>/g
  const ampScriptEmbeddedCode = ampTwitterCode.replace(
    scriptRegex,
    (match: string, attributes: string) => {
      // Get the value of the 'src' attribute
      const srcMatch = /src="([^"]*)"/.exec(attributes)
      if (srcMatch && srcMatch[1]) {
        // Replace <script> with <amp-script> and add an absolute 'src' attribute
        const absoluteSrc = `https:${srcMatch[1]}`
        return `<amp-script src="${absoluteSrc}"></amp-script>`
      }
      // If 'src' attribute is missing, replace <script> with <amp-script>
      return `<amp-script${attributes}></amp-script>`
    }
  )

  // Use regex to replace <amp-img> tags with empty string if 'src' attribute is missing
  const imgRegex = /<amp-img([^>]*)>/g
  const ampImgEmbeddedCode = ampScriptEmbeddedCode.replace(
    imgRegex,
    (match: string, attributes: string) => {
      // Check if <amp-img> includes 'src' attribute
      if (attributes.includes('src=')) {
        // Replace <amp-img> with empty string
        return `<amp-img${attributes}></amp-img>`
      }
      // If 'src' attribute is missing, return an empty string
      return ''
    }
  )

  // Use regex to replace <audio> tags with <amp-audio>
  const audioRegex = /<audio([^>]*)><\/audio>/g
  const ampAudioCode = ampImgEmbeddedCode.replace(
    audioRegex,
    (match: string, attributes: string) => {
      // Replace with <amp-audio> tag
      return `<amp-audio${attributes}></amp-audio>`
    }
  )

  // Use regex to replace <video> tags with <amp-video>
  const videoRegex = /<video([^>]*)><\/video>/g
  const ampVideoCode = ampAudioCode.replace(
    videoRegex,
    (match: string, attributes: string = '') => {
      // Replace with <amp-video> tag
      return `<amp-video${attributes.replace(
        'controls="true"',
        'controls'
      )}></amp-video>`
    }
  )

  // Use regex to replace TikTok embedded code with <amp-tiktok>
  const tiktokRegex =
    /<blockquote class="tiktok-embed"[^>]* data-video-id="([^"]+)"[^>]*>[\s\S]*?<\/blockquote>/g
  const ampTikTokCode = ampVideoCode.replace(
    tiktokRegex,
    (tiktokMatch: string, videoId: string) => {
      return `<amp-tiktok width="325" height="731" data-src="${videoId}"></amp-tiktok>`
    }
  )

  // Use regex to replace Google Maps embedded code with <amp-iframe>
  const googleMapsRegex =
    /<iframe[^>]*src="https:\/\/www\.google\.com\/maps\/embed\?([^"]+)"[^>]*><\/iframe>/g
  const ampGoogleMapsCode = ampTikTokCode.replace(
    googleMapsRegex,
    (googleMapsMatch: string, queryParams: string) => {
      return `<amp-iframe width="600" height="450" layout="responsive" sandbox="allow-scripts allow-same-origin allow-popups" src="https://www.google.com/maps/embed?${queryParams}"></amp-iframe>`
    }
  )

  const scriptStyleRegex = /<script|<style|<iframe|<embed|<nft-card/g
  if (scriptStyleRegex.test(ampGoogleMapsCode)) {
    // css hover 效果由 mm-next 的 amp-main決定。
    // a href 由 amp-proxy 決定
    return `
    <a class='link-to-story' href='${
      currentUrl ? currentUrl.replace('/amp', '') : ''
    }' style='
      display: flex; 
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%; 
      height: 210px;
      box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.15) inset;
      color: #888;
      font-family: PingFang TC;
      font-size: 16px;
      font-style: normal;
      font-weight: 300;
      line-height: 180%;
      text-decoration: none;
    '><div>AMP不支援此功能，請</div><div style='font-weight: 600; margin-bottom: 4.5px;'>點擊連結觀看完整內容</div><svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.1929 1.18239C12.7694 1.50222 12.4755 1.9516 12.3383 2.45154C11.6583 2.30243 10.9226 2.41624 10.3664 2.8688C9.91637 3.21518 9.62245 3.66456 9.51118 4.19041C8.83114 4.0413 8.09483 4.20757 7.53862 4.66013C7.24725 4.89969 7.0336 5.21697 6.87242 5.53363L4.33315 2.99436C3.47809 2.1393 2.06301 2.05155 1.13579 2.8233C0.606133 3.24932 0.283761 3.88262 0.249587 4.53865C0.215413 5.19469 0.443525 5.84755 0.909921 6.31394L7.62084 13.0249C6.28159 13.1722 5.16727 14.2347 5.04646 15.5474C4.95856 16.309 5.21131 17.0927 5.7289 17.6634C6.22057 18.2081 6.92461 18.5405 7.68492 18.5575C8.20823 18.6561 12.0812 19.3435 13.8078 19.6897C14.6187 19.8634 15.4612 19.591 16.0452 19.0069L23.2393 11.8128C24.195 10.8572 24.24 9.30936 23.2813 8.35066C21.027 6.09641 16.3371 1.40654 16.3371 1.40654C15.4555 0.578027 14.1195 0.463092 13.1929 1.18239ZM22.1669 9.41315C22.5297 9.7759 22.5221 10.4054 22.1504 10.777L14.9829 17.9446C14.7439 18.1835 14.4279 18.2922 14.0879 18.2177C12.2039 17.8734 7.91255 17.0862 7.86009 17.0868C7.80764 17.0874 7.78173 17.0615 7.72927 17.0622C7.36207 17.0666 6.99677 16.9137 6.79012 16.654C6.53101 16.3948 6.43055 16.0289 6.48745 15.6611C6.51718 15.3722 6.67773 15.1081 6.86355 14.9222C7.12902 14.6568 7.49813 14.4949 7.86533 14.4905L9.33414 14.4727C9.64888 14.4689 9.88716 14.2824 10.0218 13.9923C10.1299 13.7288 10.0813 13.4146 9.87397 13.2074L1.91932 5.25272C1.73795 5.07134 1.66212 4.83624 1.69121 4.59986C1.7203 4.36349 1.80185 4.12647 2.01358 3.96656C2.35805 3.67391 2.88199 3.72001 3.21883 4.05685L7.1832 8.02122L7.28684 8.12486L9.48927 10.3273C9.77429 10.6123 10.2464 10.6066 10.5384 10.3146C10.8304 10.0226 10.8361 9.55045 10.5511 9.26543L8.3487 7.063C8.16733 6.88163 8.0915 6.64652 8.12059 6.41014C8.14968 6.17377 8.23122 5.93676 8.44296 5.77684C8.78743 5.4842 9.31137 5.5303 9.64821 5.86714L9.8555 6.07442L11.8247 8.04365C12.1097 8.32867 12.5819 8.32295 12.8739 8.03094C13.1659 7.73893 13.1716 7.26681 12.8866 6.98179L11.021 5.11621C10.8156 4.75155 10.9263 4.27816 11.2701 4.03797C11.6139 3.79778 12.1119 3.81797 12.4488 4.15481L12.7338 4.43983L14.1071 5.81311C14.3921 6.09813 14.8642 6.09241 15.1562 5.8004C15.4482 5.50839 15.454 5.03627 15.1689 4.75125L13.8734 3.4557C13.668 3.09105 13.7787 2.61766 14.1225 2.37747C14.4663 2.13728 14.9644 2.15747 15.3012 2.49431C15.2228 2.46904 19.9127 7.1589 22.1669 9.41315Z" fill="#9D9D9D"/>
      </svg></a>
    `
  }

  const codeWithoutWrongWidth = ampGoogleMapsCode.replace(
    /width="auto"|width="100%"/,
    'width="300px"'
  )

  return codeWithoutWrongWidth
}

// AMP 允許的 HTML 標籤列表
const AMP_ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'b',
  'i',
  'u',
  'a',
  'ul',
  'ol',
  'li',
  'blockquote',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'div',
  'span',
  'img',
  'figure',
  'figcaption',
]

/**
 * 處理 <a> 標籤，從 href 屬性中提取 https:// 開頭的 URL
 * 如果找到 https:// URL，使用該 URL 作為 href
 * @param tagContent 標籤內容（不包括 < 和 >）
 * @returns 處理後的標籤內容，如果沒有有效 URL 則返回空字符串（保留原標籤）
 */
function sanitizeAnchorTag(tagContent: string): string {
  // 匹配 href 屬性（支持單引號和雙引號）
  const hrefMatch = tagContent.match(/\bhref\s*=\s*["']([^"']+)["']/i)

  if (!hrefMatch) {
    // 如果沒有 href 屬性，返回空字符串（保留原標籤）
    return ''
  }

  const hrefValue = hrefMatch[1]

  // 解碼 HTML 實體
  const decodedHref = hrefValue
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

  // 從 href 值中提取 https:// 開頭的 URL
  const urlMatch = decodedHref.match(/https:\/\/[^\s"'>]+/i)

  if (urlMatch) {
    // 找到 https:// URL，使用該 URL 作為 href
    const cleanUrl = urlMatch[0]

    // 只保留 AMP 允許的屬性（target, rel 等）
    const allowedAttrs: string[] = []

    // 檢查是否有 target 屬性
    const targetMatch = tagContent.match(/\btarget\s*=\s*["']([^"']+)["']/i)
    if (targetMatch) {
      allowedAttrs.push(`target="${targetMatch[1]}"`)
    }

    // 檢查是否有 rel 屬性
    const relMatch = tagContent.match(/\brel\s*=\s*["']([^"']+)["']/i)
    if (relMatch) {
      allowedAttrs.push(`rel="${relMatch[1]}"`)
    }

    // 構建新的 <a> 標籤，只包含允許的屬性
    const attrsStr = allowedAttrs.length > 0 ? ` ${allowedAttrs.join(' ')}` : ''
    return `a href="${cleanUrl}"${attrsStr}`
  }

  // 如果沒有找到 https:// URL，返回空字符串（保留原標籤）
  // 這樣可以避免破壞原有的 <a> 標籤結構
  return ''
}

/**
 * 清理 HTML 內容，移除或轉義非 AMP 允許的標籤
 * 對於非標準標籤（如 <this>、<THIS IS FOR>），將其轉義為 HTML 實體
 */
export function sanitizeHtmlForAmp(html: string): string {
  if (!html || typeof html !== 'string') return html || ''

  // 先處理 <a> 標籤，提取 href 中的 https:// URL
  // 這需要在其他處理之前進行，避免 <a> 標籤被錯誤轉義
  let processedHtml = html.replace(/<a\b([^>]*)>/gi, (match, tagContent) => {
    const sanitizedAnchor = sanitizeAnchorTag(tagContent)
    return sanitizedAnchor ? `<${sanitizedAnchor}>` : match
  })

  // 處理已經被瀏覽器錯誤解析的標籤（如 <this is="" for="">）
  // 這種標籤通常有空的屬性值，且標籤名稱不在允許列表中
  processedHtml = processedHtml.replace(
    /<([a-zA-Z][a-zA-Z0-9-]*)\s+([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*""\s+([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*"">/gi,
    (match, tagName, attr1, attr2) => {
      const lowerTagName = tagName.toLowerCase()
      // 如果標籤名稱不在允許列表中，轉義
      if (
        !AMP_ALLOWED_TAGS.includes(lowerTagName) &&
        !lowerTagName.startsWith('amp-')
      ) {
        return `&lt;${tagName} ${attr1}="" ${attr2}=""&gt;`
      }
      return match
    }
  )

  // 也處理單個空屬性的情況（如 <this is="">）
  processedHtml = processedHtml.replace(
    /<([a-zA-Z][a-zA-Z0-9-]*)\s+([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*"">/gi,
    (match, tagName, attr) => {
      const lowerTagName = tagName.toLowerCase()
      // 如果標籤名稱不在允許列表中，轉義
      if (
        !AMP_ALLOWED_TAGS.includes(lowerTagName) &&
        !lowerTagName.startsWith('amp-')
      ) {
        return `&lt;${tagName} ${attr}=""&gt;`
      }
      return match
    }
  )

  // 轉義所有非 AMP 允許的標籤
  // 匹配所有 <...> 格式的標籤，包括包含空格的標籤名稱（如 <THIS IS FOR>）
  return processedHtml.replace(/<([^>]+)>/g, (match, tagContent) => {
    const trimmedContent = tagContent.trim()

    // 提取標籤名稱（標籤內容的第一個單詞）
    // 處理開閉標籤：/tagName 或 tagName
    const tagNameMatch = trimmedContent.match(/^\/?([a-zA-Z][a-zA-Z0-9-]*)/)

    if (!tagNameMatch) {
      // 如果標籤名稱不符合標準格式，轉義整個標籤
      return `&lt;${tagContent}&gt;`
    }

    const tagName = tagNameMatch[1]
    const afterTagName = trimmedContent.substring(tagNameMatch[0].length).trim()

    // 檢查標籤名稱後是否緊跟著空格和大寫字母（非標準標籤名稱，如 "THIS IS FOR"）
    // 標準 HTML 標籤名稱後應該是屬性（如 href="..." 或 class="..."）或結束
    // 如果標籤名稱後是空格+大寫字母（且沒有等號），可能是非標準標籤（如 "THIS IS FOR"）
    if (
      afterTagName &&
      afterTagName.match(/^[A-Z]/) &&
      !afterTagName.includes('=')
    ) {
      // 標籤名稱包含空格（如 <THIS IS FOR>），轉義整個標籤
      return `&lt;${tagContent}&gt;`
    }

    const lowerTagName = tagName.toLowerCase()

    // 如果是 AMP 允許的標籤，保留
    // 注意：<a> 標籤已經在前面處理過了，這裡不需要重複處理
    if (AMP_ALLOWED_TAGS.includes(lowerTagName)) {
      return match
    }

    // 如果是 AMP 自定義元素（以 amp- 開頭），保留
    if (lowerTagName.startsWith('amp-')) {
      return match
    }

    // 否則轉義為 HTML 實體
    return `&lt;${tagContent}&gt;`
  })
}

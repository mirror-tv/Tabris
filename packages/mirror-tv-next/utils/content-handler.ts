/**
 * 處理 content_original 中的 figure 標籤，為有 style 屬性的 figure 添加 max-width: 100%
 * @param contentOriginal - 原始內容 HTML 字符串
 * @returns 處理後的內容 HTML 字符串
 */
export function addMaxWidthToFigureWithStyle(
  contentOriginal: string | null | undefined
): string {
  // 如果內容為空，直接返回
  if (!contentOriginal) {
    return ''
  }

  // 使用正則表達式匹配有 style 屬性的 figure 標籤
  // 匹配 <figure ... style="..." ...> 的情況，style 屬性可以在任何位置
  const figureWithStyleRegex =
    /<figure\s+[^>]*style\s*=\s*["']([^"']*)["'][^>]*>/gi

  return contentOriginal.replace(figureWithStyleRegex, (match, styleValue) => {
    // 檢查是否已經有 max-width 屬性
    if (styleValue.includes('max-width')) {
      return match // 如果已經有 max-width，直接返回原樣
    }

    // 在現有的 style 值後面添加 max-width: 100%
    const newStyleValue = styleValue.trim()
    const separator = newStyleValue.endsWith(';') ? ' ' : '; '
    const updatedStyle = `${newStyleValue}${separator}max-width: 100%`

    // 替換整個 match 中的 style 值
    return match.replace(
      /style\s*=\s*["']([^"']*)["']/,
      `style="${updatedStyle}"`
    )
  })
}

/**
 * 移除純文字格式化的 HTML 標籤，保留有意義的內容標籤
 * @param content - HTML 字符串
 * @returns 清理後的 HTML 字符串
 */
export function removeTextFormattingTags(content: string): string {
  if (!content) {
    return ''
  }

  // 定義需要移除的純文字格式化標籤
  const formattingTags = [
    'p',
    'br',
    'em',
    'i',
    'strong',
    'b',
    'u',
    's',
    'strike',
    'del',
    'span',
    'font',
    'small',
    'big',
    'sub',
    'sup',
    'mark',
    'ins',
  ]

  let result = content

  // 移除這些標籤的開始和結束標籤，但保留內容
  formattingTags.forEach((tag) => {
    // 移除自閉合標籤如 <br>, <br/>
    const selfClosingRegex = new RegExp(`<${tag}\\s*[^>]*?/?>`, 'gi')
    result = result.replace(selfClosingRegex, '')

    // 移除成對標籤如 <p>...</p>
    const pairedRegex = new RegExp(`<${tag}\\s*[^>]*?>(.*?)<\\/${tag}>`, 'gi')
    result = result.replace(pairedRegex, '$1')
  })

  // 清理多餘的空白字符
  result = result
    .replace(/\s+/g, ' ') // 將多個空白字符替換為單個空格
    .replace(/>\s+</g, '><') // 移除標籤之間的空白
    .trim()

  return result
}

/**
 * 移除 content_original 中與 heroCaption 重複的第一段，並清理文字格式化標籤
 * @param contentOriginal - 原始內容 HTML 字符串
 * @param heroCaption - 英雄圖片說明文字
 * @returns 處理後的內容 HTML 字符串
 */
export function removeDuplicateFirstParagraph(
  contentOriginal: string | null | undefined,
  heroCaption: string | null | undefined
): string {
  if (!contentOriginal || !heroCaption) {
    return contentOriginal || ''
  }

  const cleanHeroCaption = heroCaption.trim()

  if (!cleanHeroCaption) {
    return contentOriginal
  }

  // 使用正則表達式來匹配第一個段落
  // 匹配 <p>...</p> 或 <figure>...</figure> 或 <div>...</div> 等塊級元素
  const firstBlockRegex =
    /^(\s*<(?:p|figure|div|section|article)[^>]*>.*?<\/(?:p|figure|div|section|article)>\s*)/i
  const match = contentOriginal.match(firstBlockRegex)

  if (!match) {
    const firstTextRegex = /^(\s*[^<\n]+(?:\n[^<\n]+)*)/m
    const textMatch = contentOriginal.match(firstTextRegex)

    if (textMatch) {
      const firstText = textMatch[1].trim()
      if (
        firstText === cleanHeroCaption ||
        firstText.startsWith(cleanHeroCaption)
      ) {
        const remainingContent = contentOriginal
          .replace(firstTextRegex, '')
          .trim()
        return removeTextFormattingTags(remainingContent)
      }
    }
    return removeTextFormattingTags(contentOriginal)
  }

  const firstBlock = match[1]

  // 提取段落中的純文字內容，移除 HTML 標籤
  const textContent = firstBlock
    .replace(/<[^>]*>/g, '') // 移除所有 HTML 標籤
    .replace(/\s+/g, ' ') // 將多個空白字符替換為單個空格
    .trim()

  // 如果第一段是空的（沒有文字內容），則跳過它，尋找下一個有內容的段落
  if (!textContent) {
    // 移除空的段落，然後遞歸調用自己來處理剩餘內容
    const remainingContent = contentOriginal.replace(firstBlockRegex, '').trim()
    return removeDuplicateFirstParagraph(remainingContent, heroCaption)
  }

  // 比較純文字內容與 heroCaption
  // 檢查第一段是否包含或開始於 heroCaption
  if (
    textContent === cleanHeroCaption ||
    textContent.startsWith(cleanHeroCaption)
  ) {
    // 移除第一個段落
    const remainingContent = contentOriginal.replace(firstBlockRegex, '').trim()
    return removeTextFormattingTags(remainingContent)
  }

  return removeTextFormattingTags(contentOriginal)
}

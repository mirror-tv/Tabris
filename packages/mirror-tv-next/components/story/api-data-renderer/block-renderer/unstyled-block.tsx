'use client'
import styles from './_styles/unstyled-block.module.scss'
import {
  type ApiDataBlockBase,
  type ApiDataSection,
  ApiDataBlockType,
} from './type'
import { sanitizeHtmlForAmp } from '~/utils/amp'
import { getFirstElement } from '~/utils/common'
import AnnotationBlock from './annotation-block'

export interface ApiDataUnstyled extends ApiDataBlockBase {
  type: ApiDataBlockType.Unstyled
  content: string | string[]
  alignment: 'center'
}

// 支援 data-entity-type 與 data-annotation-body 任意順序
const INLINE_ANNOTATION_REGEX =
  /<span\s+(?:data-entity-type="annotation"\s+data-annotation-body="([^"]*)"|data-annotation-body="([^"]*)"\s+data-entity-type="annotation")[^>]*>([\s\S]*?)<\/span>/g

function decodeAnnotationBody(encoded: string): string {
  return encoded
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
}

type InlineAnnotationPart = { kind: 'annotation'; text: string; body: string }
type TextPart = { kind: 'text'; html: string }
type UnstyledPart = TextPart | InlineAnnotationPart

function parseUnstyledContent(html: string): UnstyledPart[] {
  const parts: UnstyledPart[] = []
  let lastIndex = 0
  let m: RegExpExecArray | null
  INLINE_ANNOTATION_REGEX.lastIndex = 0
  while ((m = INLINE_ANNOTATION_REGEX.exec(html)) !== null) {
    if (m.index > lastIndex) {
      parts.push({ kind: 'text', html: html.slice(lastIndex, m.index) })
    }
    const bodyEncoded = m[1] ?? m[2]
    parts.push({
      kind: 'annotation',
      text: m[3],
      body: decodeAnnotationBody(bodyEncoded),
    })
    lastIndex = m.index + m[0].length
  }
  if (lastIndex < html.length) {
    parts.push({ kind: 'text', html: html.slice(lastIndex) })
  }
  return parts.length ? parts : [{ kind: 'text', html }]
}

const UnstyledBlock = ({
  data,
  className,
  isAmp,
}: {
  data: ApiDataUnstyled | ApiDataSection
  className?: string
  isAmp?: boolean
}) => {
  const rawContent = Array.isArray(data.content)
    ? getFirstElement(data.content)
    : data.content
  const content = isAmp ? sanitizeHtmlForAmp(rawContent) : rawContent

  const hasInlineAnnotation =
    typeof content === 'string' &&
    content.includes('data-entity-type="annotation"')
  const parts = hasInlineAnnotation ? parseUnstyledContent(content) : null

  if (parts && parts.length > 0) {
    return (
      <p className={`${styles.textBlock} ${className}`}>
        {parts.map((part, i) =>
          part.kind === 'text' ? (
            <span key={i} dangerouslySetInnerHTML={{ __html: part.html }} />
          ) : (
            <AnnotationBlock
              key={i}
              data={{
                type: ApiDataBlockType.Annotation,
                id: `inline-anno-${i}`,
                content: [''],
                alignment: 'center',
              }}
              inline
              inlineContent={{ text: part.text, annotation: part.body }}
            />
          )
        )}
      </p>
    )
  }

  return (
    <p
      className={`${styles.textBlock} ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default UnstyledBlock

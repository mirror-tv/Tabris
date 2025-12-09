import styles from './_styles/unstyled-block.module.scss'
import { type ApiDataBlockBase, ApiDataBlockType } from './type'
import { sanitizeHtmlForAmp } from '~/utils/amp'
import { getFirstElement } from '~/utils/common'

export interface ApiDataUnstyled extends ApiDataBlockBase {
  type: ApiDataBlockType.Unstyled
  content: string | string[]
  alignment: 'center'
}
const UnstyledBlock = ({
  data,
  className,
  isAmp,
}: {
  data: ApiDataUnstyled
  className?: string
  isAmp?: boolean
}) => {
  // 處理 content 可能是數組的情況
  const rawContent = Array.isArray(data.content)
    ? getFirstElement(data.content)
    : data.content
  const content = isAmp ? sanitizeHtmlForAmp(rawContent) : rawContent

  return (
    <p
      className={`${styles.textBlock} ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default UnstyledBlock

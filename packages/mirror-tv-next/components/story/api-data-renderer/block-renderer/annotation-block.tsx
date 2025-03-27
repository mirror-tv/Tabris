'use client'
import { ApiDataBlockBase, type ApiDataBlockType } from './type'
import styles from './_styles/annotation-block.module.scss'
import { useCallback, useState } from 'react'
import { getFirstElement } from '~/utils/common'

// 提取 text 和 annotation 的函數
const extractAnnotationData = (blockContentData: string) => {
  const regexForAnnotation = /<!--__ANNOTATION__=\{(.*?)\}-->/
  const blockContentDataMatched = blockContentData.match(regexForAnnotation)

  // NOTE: 如果 blockContentDataMatched 有值，則提取 annotation 的 text 和 annotation
  if (blockContentDataMatched && blockContentDataMatched[1]) {
    const jsonString = `{${blockContentDataMatched[1]}}`
    const annotationData = JSON.parse(jsonString)
    return {
      text: annotationData.text,
      annotation: annotationData.annotation,
    }
  }
  return null
}
export interface ApiDataAnnotation extends ApiDataBlockBase {
  type: ApiDataBlockType.Annotation
  content: [string]
  alignment: 'center'
}
function indicatorSvg(shouldRotate: boolean, onClickCallBack: () => void) {
  const transform = shouldRotate ? 'rotate(180)' : 'rotate(0)' // 確保在關閉時旋轉回來
  return (
    <svg
      className={styles.rotated}
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      transform={transform}
      onClick={onClickCallBack}
    >
      <circle cx="10" cy="10" r="10" fill="none" stroke="#90A5DB" />
      <path d="M10 15L5.66987 7.5L14.3301 7.5L10 15Z" fill="#004DB8" />
    </svg>
  )
}
const AnnotationBlock = ({ data }: { data: ApiDataAnnotation }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const blockContentData = getFirstElement(data.content)
  const annotationData = extractAnnotationData(blockContentData)

  return (
    <div className={styles.annotationBlock}>
      <p className={styles.annotationTitle}>
        <span className={styles.annotationText}>{annotationData?.text}</span>
        <span className={styles.toggleButton} onClick={toggleOpen}>
          (註)
        </span>
        {indicatorSvg(isOpen, toggleOpen)}
      </p>
      {isOpen ? (
        <p
          className={styles.annotationContent}
          dangerouslySetInnerHTML={{
            __html: annotationData?.annotation,
          }}
        />
      ) : null}
    </div>
  )
}

export default AnnotationBlock

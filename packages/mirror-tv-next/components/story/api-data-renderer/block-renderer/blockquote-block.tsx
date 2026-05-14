import Image from 'next/image'
import styles from './_styles/blockquote-block.module.scss'
import { type ApiDataBlockBase, ApiDataBlockType } from './type'
import { getFirstElement } from '~/utils/common'
import { withBasePath } from '~/constants/with-base-path'

export interface ApiDataBlockquote extends ApiDataBlockBase {
  type: ApiDataBlockType.Blockquote
  content: Array<string>
  alignment: 'center'
}

const BlockquoteBlock = ({ data }: { data: ApiDataBlockquote }) => {
  const mergeClasses = (...classes: string[]) => classes.join(' ')
  const blockContentData = getFirstElement(data.content)

  // 如果 blockContentData 為空，則返回 null
  if (!blockContentData) return null

  return (
    <div className={styles.blockquoteBlock}>
      <div className={mergeClasses(styles.imageContainer, styles.start)}>
        <div className={styles.imageWrapper}>
          <Image
            src={withBasePath('/icons/icon-quote-start.svg')}
            alt="quote start"
            fill
          />
        </div>
      </div>
      <blockquote>
        <p dangerouslySetInnerHTML={{ __html: blockContentData }} />
      </blockquote>
      <div className={mergeClasses(styles.imageContainer, styles.end)}>
        <div className={styles.imageWrapper}>
          <Image
            src={withBasePath('/icons/icon-quote-end.svg')}
            alt="quote end"
            fill
          />
        </div>
      </div>
    </div>
  )
}

export default BlockquoteBlock

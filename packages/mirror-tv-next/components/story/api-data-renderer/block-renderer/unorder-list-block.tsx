import { getFirstElement } from '~/utils/common'
import styles from './_styles/unorder-list-block.module.scss'
import { ApiDataBlockType, type ApiDataBlockBase } from './type'

export interface ApiDataUnorderListBlock extends ApiDataBlockBase {
  type: ApiDataBlockType.UnOrderList
  content: string[][]
  alignment: 'center'
}

const UnorderListBlock = ({ data }: { data: ApiDataUnorderListBlock }) => {
  const firstElement = getFirstElement(data.content)
  const blockContentData =
    typeof firstElement === 'string' ? data.content : firstElement
  return (
    <ul className={styles.unOrderListBlock}>
      {blockContentData?.map((listData, index) => (
        <li key={index} dangerouslySetInnerHTML={{ __html: listData }} />
      ))}
    </ul>
  )
}

export default UnorderListBlock

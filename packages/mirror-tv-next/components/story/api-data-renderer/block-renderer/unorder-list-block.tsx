import { getFirstElement } from '~/utils/common'
import styles from './_styles/unorder-list-block.module.scss'
import { ApiDataBlockType, type ApiDataBlockBase } from './type'

export interface ApiDataUnorderListBlock extends ApiDataBlockBase {
  type: ApiDataBlockType.UnOrderList
  content: string[][]
  alignment: 'center'
}

const UnorderListBlock = ({ data }: { data: ApiDataUnorderListBlock }) => {
  const blockContentData = getFirstElement(data.content)
  return (
    <ul className={styles.unOrderListBlock}>
      {blockContentData.map((listData, index) => (
        <li key={index}>{listData}</li>
      ))}
    </ul>
  )
}

export default UnorderListBlock

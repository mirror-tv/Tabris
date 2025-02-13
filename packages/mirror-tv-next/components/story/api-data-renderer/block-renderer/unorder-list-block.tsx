import { getFirstElement } from '~/utils/common'
import styles from './_styles/unorder-list-block.module.scss'
import { ApiDataBlockType, type ApiDataBlockBase } from './type'

export interface ApiDataUnOrderListBlock extends ApiDataBlockBase {
  type: ApiDataBlockType.UnOrderList
  content: string[][]
  alignment: 'center'
}

const UnorderListBlock = ({ data }: { data: ApiDataUnOrderListBlock }) => {
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

import { getFirstElement } from '~/utils/common'
import styles from './_styles/order-list-block.module.scss'
import { ApiDataBlockBase, ApiDataBlockType } from './type'

export interface ApiDataOrderList extends ApiDataBlockBase {
  type: ApiDataBlockType.OrderList
  content: string[][]
  alignment: 'center'
}

const OrderListBlock = ({ data }: { data: ApiDataOrderList }) => {
  const blockContentData = getFirstElement(data.content)
  return (
    <ol className={styles.orderListBlock}>
      {blockContentData.map((listData, index) => (
        <li key={index}>{listData}</li>
      ))}
    </ol>
  )
}

export default OrderListBlock

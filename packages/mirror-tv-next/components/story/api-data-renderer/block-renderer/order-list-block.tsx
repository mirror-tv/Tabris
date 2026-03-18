import { getFirstElement } from '~/utils/common'
import styles from './_styles/order-list-block.module.scss'
import { type ApiDataBlockBase, ApiDataBlockType } from './type'

export interface ApiDataOrderList extends ApiDataBlockBase {
  type: ApiDataBlockType.OrderList
  content: string[][]
  alignment: 'center'
}

const OrderListBlock = ({ data }: { data: ApiDataOrderList }) => {
  const firstElement = getFirstElement(data.content)
  const blockContentData =
    typeof firstElement === 'string' ? data.content : firstElement
  return (
    <ol className={styles.orderListBlock}>
      {blockContentData.map((listData, index) => (
        <li key={index} dangerouslySetInnerHTML={{ __html: listData }} />
      ))}
    </ol>
  )
}

export default OrderListBlock

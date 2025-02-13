import { getFirstElement } from '~/utils/common'
import styles from './_styles/headers-block.module.scss'
import { ApiDataBlockType, type ApiDataBlockBase } from './type'
export interface ApiHeadersBlock extends ApiDataBlockBase {
  type: ApiDataBlockType.HeaderOne | ApiDataBlockType.HeaderTwo
  content: Array<string>
  alignment: 'center'
}
const HeadersBlock = ({
  data,
  blockType,
}: {
  data: ApiHeadersBlock
  blockType: ApiHeadersBlock['type']
}) => {
  const blockContentData = getFirstElement(data.content)

  const renderHeader = () => {
    switch (blockType) {
      case 'header-one':
        return <h1 dangerouslySetInnerHTML={{ __html: blockContentData }} />
      case 'header-two':
        return <h2 dangerouslySetInnerHTML={{ __html: blockContentData }} />
      default:
        console.error(`Unhandled block type: ${blockType}`)
        return null
    }
  }

  return <div className={styles.headersBlock}>{renderHeader()}</div>
}

export default HeadersBlock

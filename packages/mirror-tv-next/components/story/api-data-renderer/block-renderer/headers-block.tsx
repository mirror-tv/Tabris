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
  blockType: ApiDataBlockType.HeaderOne | ApiDataBlockType.HeaderTwo
}) => {
  const blockContentData = getFirstElement(data.content)

  const renderHeader = () => {
    switch (blockType) {
      case ApiDataBlockType.HeaderOne:
        // 為了 SEO 優化，將文章內容中的 h1 改為 h2，避免與文章標題的 h1 衝突
        return <h2 dangerouslySetInnerHTML={{ __html: blockContentData }} />
      case ApiDataBlockType.HeaderTwo:
        return <h2 dangerouslySetInnerHTML={{ __html: blockContentData }} />
      default:
        console.error(`Unhandled block type: ${blockType}`)
        return null
    }
  }

  return <div className={styles.headersBlock}>{renderHeader()}</div>
}

export default HeadersBlock

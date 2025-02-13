import { ApiDataBlockType, type ApiDataBlockBase } from './type'
import styles from './_styles/info-box-block.module.scss'
import { getFirstElement } from '~/utils/common'
type ContentInfoBox = {
  body: string
  title: string
}

export interface ApiDataInfoBox extends ApiDataBlockBase {
  type: ApiDataBlockType.InfoBox
  content: [ContentInfoBox]
  alignment: 'center'
}

const InfoBoxBlock = ({ data }: { data: ApiDataInfoBox }) => {
  const blockContentData = getFirstElement(data.content)
  const { title, body } = blockContentData
  return (
    <div className={styles.infoBoxWrapper}>
      <p className={styles.infoBoxTitle}>{title}</p>
      <div
        className="info-box-body"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  )
}

export default InfoBoxBlock

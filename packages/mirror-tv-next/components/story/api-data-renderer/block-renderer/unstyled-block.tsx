import styles from './_styles/unstyled-block.module.scss'
import { type ApiDataBlockBase, ApiDataBlockType } from './type'

export interface ApiDataUnstyled extends ApiDataBlockBase {
  type: ApiDataBlockType.Unstyled
  content: string
  alignment: 'center'
}
const UnstyledBlock = ({ data }: { data: ApiDataUnstyled }) => {
  return (
    <p
      className={styles.textBlock}
      dangerouslySetInnerHTML={{ __html: data.content }}
    />
  )
}

export default UnstyledBlock

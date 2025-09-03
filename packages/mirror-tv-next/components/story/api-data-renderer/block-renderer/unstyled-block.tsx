import styles from './_styles/unstyled-block.module.scss'
import { type ApiDataBlockBase, ApiDataBlockType } from './type'

export interface ApiDataUnstyled extends ApiDataBlockBase {
  type: ApiDataBlockType.Unstyled
  content: string
  alignment: 'center'
}
const UnstyledBlock = ({
  data,
  className,
}: {
  data: ApiDataUnstyled
  className?: string
}) => {
  return (
    <p
      className={`${styles.textBlock} ${className}`}
      dangerouslySetInnerHTML={{ __html: data.content }}
    />
  )
}

export default UnstyledBlock

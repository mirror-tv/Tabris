import {
  type ApiDataBlockBase,
  ApiDataBlockType,
} from '../../api-data-renderer/block-renderer/type'
import styled from 'styled-components'
import { convertEmbeddedToAmp } from '../../../../utils/amp'

type ContentEmbedCode = {
  caption: string
  scripts: unknown[]
  embeddedCode: string
  embeddedCodeWithoutScript: string
}

export interface ApiDataEmbedCode extends ApiDataBlockBase {
  type: ApiDataBlockType.EmbedCode
  content: [ContentEmbedCode]
  alignment: 'center'
}

export default function AmpEmbedded({
  data,
  currentUrl,
}: {
  data: ApiDataEmbedCode
  currentUrl?: string
}) {
  const { caption } = data.content[0]

  return (
    <section>
      <div
        className="amp-embedded-wrapper"
        dangerouslySetInnerHTML={{
          __html: convertEmbeddedToAmp(
            data.content[0]?.embeddedCode ?? '',
            currentUrl
          ),
        }}
      />
      {caption && <div className="caption">{caption}</div>}
    </section>
  )
}

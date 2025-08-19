import React from 'react'

type JsonLdData = {
  '@context': string
  '@type': string
  [key: string]: any // 對於 JSON-LD 的動態屬性，保留 any
}

type JsonLdProps = {
  data: JsonLdData[]
}

const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  return (
    <>
      {data.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item),
          }}
        />
      ))}
    </>
  )
}

export default JsonLd

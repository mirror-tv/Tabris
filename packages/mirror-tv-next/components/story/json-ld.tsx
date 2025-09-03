import React from 'react'

type JsonLdData = {
  '@context': string
  '@type': string
  [key: string]: string | number | boolean | object | null
}

type JsonLdProps = {
  data: JsonLdData[]
}

const JsonLd = ({ data }: JsonLdProps) => {
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

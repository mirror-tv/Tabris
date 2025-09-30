import { CONTACT_MAPPING } from '~/constants/constant'
import { type SinglePost } from '~/graphql/query/story'
import { formateDateAtTaipei } from '~/utils'

type HeroInfoProps = {
  title: string
  publishTime: string
  categories: SinglePost['categories']
  writers: SinglePost['writers']
  photographers: SinglePost['photographers']
  cameraOperators: SinglePost['cameraOperators']
  designers: SinglePost['designers']
  engineers: SinglePost['engineers']
  vocals: SinglePost['vocals']
  otherbyline: string
}

export default function HeroInfo({
  title,
  publishTime,
  categories,
  writers,
  photographers,
  cameraOperators,
  designers,
  engineers,
  vocals,
  otherbyline,
}: HeroInfoProps) {
  const creditList = Object.entries(CONTACT_MAPPING)
    .map(([key, title]) => ({
      title,
      list:
        {
          writers,
          photographers,
          cameraOperators,
          designers,
          engineers,
          vocals,
        }[key as keyof typeof CONTACT_MAPPING] || [],
    }))
    .filter(({ list }) => list.length > 0)
  const publishTimeTaipei = formateDateAtTaipei(
    new Date(publishTime),
    'YYYY.MM.DD HH:mm',
    '臺北時間'
  )

  return (
    <>
      <div className="amp-hero-category-time amp__main__category-publishTime">
        <span className="amp-hero-category amp-pub-cat-category">
          {!!categories?.[0]?.title && categories?.[0]?.title}
        </span>
        {!!publishTime && (
          <span className="amp-hero-publish-time amp-pub-cat-publishTime">
            {publishTimeTaipei}
          </span>
        )}
      </div>
      <h1 className="amp-hero-title">{title}</h1>
      {!!creditList.length && (
        <ul className="amp-hero-credits">
          {creditList.map((item) => {
            return (
              <li key={item.title} className="amp-hero-credit-item">
                {item.title}｜
                {item.list?.map(
                  (person, key) => `${key ? '、' : ''}${person.name}`
                )}
              </li>
            )
          })}
          <li key="other" className="amp-hero-credit-item">
            {otherbyline}
          </li>
        </ul>
      )}
    </>
  )
}

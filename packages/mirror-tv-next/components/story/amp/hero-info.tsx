import styled from 'styled-components'
import { CONTACT_MAPPING } from '~/constants/constant'
import { type SinglePost } from '~/graphql/query/story'
import { formateDateAtTaipei } from '~/utils'

const CategoryAndPublishTime = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 8px;
`

const Category = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  color: #014db8;
`

const PublishTime = styled.span`
  font-size: 14px;
  line-height: 1.5;
  color: #000;
`

const StyledTitle = styled.h1`
  font-size: 20px;
  font-weight: 500;
  line-height: 1.4;
  color: #000;
  margin: 0 0 8px;
`

const CreditsWrapper = styled.ul`
  margin: 0 0 24px;
  list-style-type: none;
  padding: 0;
`

const CreditItem = styled.li`
  display: inline-block;
  font-size: 14px;
  line-height: 1.4;
  margin: 0 12px 0 0;
`

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
      <CategoryAndPublishTime className='class="amp__main__category-publishTime"'>
        <Category className="amp-pub-cat-category">
          {categories?.[0]?.title}
        </Category>
        {publishTime && (
          <PublishTime className="amp-pub-cat-publishTime">
            {publishTimeTaipei}
          </PublishTime>
        )}
      </CategoryAndPublishTime>
      <StyledTitle>{title}</StyledTitle>
      {creditList.length && (
        <CreditsWrapper>
          {creditList.map((item) => {
            return (
              <CreditItem key={item.title}>
                {item.title}｜
                {item.list?.map(
                  (person, key) => `${key ? '、' : ''}${person.name}`
                )}
              </CreditItem>
            )
          })}
          <CreditItem key="other">{otherbyline}</CreditItem>
        </CreditsWrapper>
      )}
    </>
  )
}

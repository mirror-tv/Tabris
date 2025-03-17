import styled from 'styled-components'
import { SingleRelatedPost } from '~/graphql/query/story'

const Wrapper = styled.section`
  padding: 0 16px;
  margin-bottom: 48px;
`

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0.5px;
  color: #014db8;
  margin-bottom: 20px;
`

const CardItem = styled.li`
  margin-top: 20px;
  display: block;
  margin-left: -40px;
`

const CardLink = styled.a`
  display: flex;
  text-decoration: none;
`

const CardTitle = styled.span`
  font-size: 16px;
  color: #4a4a4a;
  text-align: left;
  line-height: 22px;
`

type PostListProps = {
  title: string
  list: SingleRelatedPost[]
}

export default function RelatedPostList({ title, list }: PostListProps) {
  return (
    <Wrapper>
      <SectionTitle>{title}</SectionTitle>
      <ul className="amp-card-list">
        {list?.map((item) => {
          return (
            <CardItem
              key={`list-article-${item.slug}`}
              className="amp-card-list-item"
            >
              <CardLink
                href={`/story/amp/${item.slug}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                <CardTitle>{item.name}</CardTitle>
              </CardLink>
            </CardItem>
          )
        })}
      </ul>
    </Wrapper>
  )
}

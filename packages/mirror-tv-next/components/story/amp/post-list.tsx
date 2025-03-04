import styled from 'styled-components'
import { FormattedPostCard } from '~/utils'
import { getHeroImageOfAmp } from '~/utils/image-handler'

const Wrapper = styled.section`
  padding: 0 16px;
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
  margin-top: 12px;
  display: block;
  margin-left: -40px;
`

const CardLink = styled.a`
  display: flex;
  text-decoration: none;
`

const ImageWrapper = styled.div`
  position: relative;
  .amp-card-list-item-image-image {
    img {
      object-fit: cover;
    }
  }
`

const CardTitle = styled.span`
  font-size: 16px;
  color: #4a4a4a;
  text-align: left;
  line-height: 1.3;
  word-wrap: break-word;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-left: 12px;
  max-height: 62px; // 16px * 1.3 * 3
`

type PostListProps = {
  title: string
  list: FormattedPostCard[]
}

export default function PostList({ title, list }: PostListProps) {
  return (
    <Wrapper>
      <SectionTitle>{title}</SectionTitle>
      <ul className="amp-card-list">
        {list?.map((item) => {
          const heroSrc = getHeroImageOfAmp(item.images)
          return (
            <CardItem
              key={`list-article-${item.slug}`}
              className="amp-card-list-item"
            >
              <CardLink
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                <ImageWrapper>
                  <amp-img
                    alt={item.name}
                    src={heroSrc}
                    width="130"
                    height="130"
                    layout="fixed"
                    className="amp-card-list-item-image-image"
                  />
                </ImageWrapper>
                <CardTitle>{item.name}</CardTitle>
              </CardLink>
            </CardItem>
          )
        })}
      </ul>
    </Wrapper>
  )
}

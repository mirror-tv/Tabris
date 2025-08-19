import React from 'react'
import Link from 'next/link'
import styles from './_styles/tag.module.scss'
import type { SinglePost } from '~/graphql/query/story'

type TagsListProps = {
  tags: SinglePost['tags']
}

const TagsList: React.FC<TagsListProps> = ({ tags }) => {
  return (
    <div className={styles.tagsList}>
      {tags.map((tag) => (
        <Link
          href={`/tag/${tag.name}`}
          className={styles.tag}
          target="_blank"
          rel="noreferrer noopener"
          key={tag.name}
        >
          <span>{tag.name}</span>
        </Link>
      ))}
    </div>
  )
}

export default TagsList

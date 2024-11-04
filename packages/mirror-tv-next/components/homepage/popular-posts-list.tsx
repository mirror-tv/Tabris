'use client'
import { useData } from '~/context/data-context'
// import styles from './_styles/popular-posts-list.module.scss'
import { useEffect } from 'react'

export default function PopularPostsList() {
  const { popularPosts } = useData()

  useEffect(() => {
    console.log(popularPosts)
  }, [popularPosts])

  return <section></section>
}

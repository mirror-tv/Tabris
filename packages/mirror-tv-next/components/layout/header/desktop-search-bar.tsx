'use client'
import styles from './_styles/header-search-bar.module.scss'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

const HeaderSearchBar = () => {
  const [keyword, setKeyword] = useState('')
  const router = useRouter()

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (keyword.trim()) {
      router.push(`/search/${keyword}`)
    }
  }
  return (
    <form className={styles.container} onSubmit={handleSearch}>
      <input
        className={styles.input}
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button type="submit" className={`${styles.searchButton} search-icon`}>
        <Image
          className={styles.searchInputIcon}
          src="/icons/icon-search.svg"
          alt="search icon"
          layout="fill"
        />
      </button>
    </form>
  )
}

export default HeaderSearchBar

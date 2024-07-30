'use client'
import { useState } from 'react'
import styles from './_styles/search-bar.module.scss'
import Link from 'next/link'
import Image from 'next/image'

const MobileSearchBar = () => {
  const [isSearchBarShown, setIsSearchBarShown] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const toggleSearchBar = () => {
    setIsSearchBarShown((prevState) => !prevState)
    setKeyword('')
    setIsSearching(false)
  }

  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }
  const handleSearch = () => {
    setIsSearching(true)
  }

  const handleResetKeyword = () => {
    setKeyword('')
  }
  const searchIconClassName = isSearchBarShown
    ? `${styles.logo} ${styles.isActive}`
    : styles.logo

  return (
    <div className={styles.searchBarContainer}>
      <button onClick={toggleSearchBar}>
        <div className={searchIconClassName} />
      </button>
      {isSearchBarShown && (
        <section className={styles.searchBarSection}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="請輸入關鍵字"
              className={`${styles.searchInput} ${
                isSearching && styles.isSearchingInput
              }`}
              value={keyword}
              onChange={handleInputOnChange}
            />
            <div className={styles.searchIconWrapper}>
              <button onClick={handleResetKeyword}>
                <Image
                  className={styles.resetIcon}
                  src="/icons/icon-cross.svg"
                  alt="search icon"
                  width={16}
                  height={16}
                />
              </button>
              <Link href={`/search/${keyword}`} onClick={handleSearch}>
                <div
                  className={`${styles.searchIcon} ${
                    isSearching && styles.isSearchingIcon
                  }`}
                >
                  GO
                </div>
              </Link>
            </div>
          </div>
          {!isSearching && <div className={styles.modalOverlay} />}
        </section>
      )}
    </div>
  )
}

export default MobileSearchBar

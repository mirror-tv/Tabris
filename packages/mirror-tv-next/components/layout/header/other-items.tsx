import Image from 'next/image'
import Link from 'next/link'
import { HEADER_BOTTOM_LINKS } from '~/constants/constant'
import { withBasePath } from '~/constants/with-base-path'
import styles from './_styles/other-items.module.scss'

export default function OtherItems(): JSX.Element {
  return (
    <nav
      className={[styles.otherItemsWrapper, 'bottom-wrapper__bottom'].join(' ')}
    >
      <ul className={styles.items}>
        {[
          { href: HEADER_BOTTOM_LINKS.ombuds, text: '公評人專區' },
          { href: HEADER_BOTTOM_LINKS.anchorperson, text: '鏡主播' },
          { href: HEADER_BOTTOM_LINKS.about, text: '關於我們' },
          {
            href: HEADER_BOTTOM_LINKS.fb,
            iconSrc: '/icons/icon-fb.svg',
            alt: 'facebook icon',
          },
          {
            href: HEADER_BOTTOM_LINKS.line,
            iconSrc: '/icons/icon-line.svg',
            alt: 'line icon',
          },
          {
            href: HEADER_BOTTOM_LINKS.ig,
            iconSrc: '/icons/icon-ig.svg',
            alt: 'instagram icon',
          },
          {
            href: HEADER_BOTTOM_LINKS.x,
            iconSrc: '/icons/icon-x.svg',
            alt: 'x(former twitter) icon',
          },
        ].map((item, index) => (
          <li key={index} className={item.iconSrc ? styles.icon : styles.li}>
            <Link
              href={item.href}
              target={item.iconSrc ? '_blank' : undefined}
              rel={item.iconSrc ? 'noopener noreferrer' : undefined}
              className="category-nav__link"
            >
              {item.iconSrc ? (
                <Image
                  src={withBasePath(item.iconSrc)}
                  alt={item.alt || ''}
                  width={20}
                  height={20}
                />
              ) : (
                item.text
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

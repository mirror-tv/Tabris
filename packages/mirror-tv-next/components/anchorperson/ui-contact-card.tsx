'use client'
// import Image from '@readr-media/react-image'
// import Link from 'next/link'
import type { Contact } from '~/graphql/query/contact'
// import styles from './_styles/ui-contact-card.module.scss'
// import { formateHeroImage } from '~/utils'
type Props = {
  item: Contact
}

export default function UiContactCard({ item }: Props) {
  // const formattedHeroImage = formateHeroImage(item.anchorImg)
  console.log(item)
  return (
    <></>
    // <Link
    //   href={`/anchorperson/${item.slug}`}
    //   target="_blank"
    //   rel="noopener noreferrer"
    // >
    //   <li className={styles.card}>
    //     <figure>
    //       <div className={styles.imageWrapper}>
    //         <Image
    //           images={formattedHeroImage}
    //           alt={item.name}
    //           loadingImage="/images/loading.svg"
    //           defaultImage="/images/image-default.jpg"
    //           rwd={{
    //             mobile: '500px',
    //             tablet: '500px',
    //             laptop: '500px',
    //             desktop: '500px',
    //             default: '500px',
    //           }}
    //         />
    //       </div>
    //       <figcaption>{item.name}</figcaption>
    //     </figure>
    //   </li>
    // </Link>
  )
}

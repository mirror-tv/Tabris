import Link from 'next/link'
import ResponsiveImage from '~/components/shared/responsive-image'
import styles from './_styles/ui-host-list.module.scss'
import { HostOrStaff } from '~/graphql/query/shows'
import { formateHeroImage, handleApiData } from '~/utils'

export default function UiHostList({ hostList }: { hostList: HostOrStaff[] }) {
  const formatBio = (item: HostOrStaff): { id: string; content: string }[] => {
    if (!item.bioApiData) return []
    const bios = handleApiData(item.bioApiData)
    return bios?.map((item) => {
      return {
        id: item?.id || '',
        content: item?.content?.[0] || '',
      }
    })
  }
  return (
    <ol className={`${styles.list} host-list`}>
      {hostList.map((hostItem) => {
        const bios = formatBio(hostItem)[0]
        return (
          <li key={hostItem.name}>
            <Link
              target="_blank"
              rel="noreferrer noopener"
              href={`/anchorperson/${hostItem.slug}`}
              className={styles.item}
            >
              <figure className={styles.imageWrapper}>
                <ResponsiveImage
                  images={formateHeroImage(hostItem.showhostImg || {})}
                  alt="主持人圖片"
                  rwd={{
                    mobile: '80px',
                    tablet: '80px',
                    laptop: '80px',
                    desktop: '80px',
                    default: '80px',
                  }}
                  priority={false}
                />
              </figure>
              <div className={styles.content}>
                <h3 className={styles.name}>主持人｜{hostItem.name}</h3>
                {bios && (
                  <p
                    className={styles.bio}
                    dangerouslySetInnerHTML={{
                      __html: bios.content?.replace(/\n/g, '<br>'),
                    }}
                  />
                )}
              </div>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}

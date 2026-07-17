import Image from 'next/image'
import Link from '~/components/shared/link'
import styles from './_styles/iconLinkList.module.scss'

type InfoList = {
  id: number
  img: string
  t1: string
  t2: string
  href: string
  title: string
}

const infoList: InfoList[] = [
  {
    id: 1,
    img: 'icons/icon-tv.svg',
    t1: '關於鏡新聞',
    t2: '公評人',
    href: '/story/biography',
    title: '關於鏡新聞公評人',
  },
  {
    id: 2,
    img: 'icons/icon-phone.svg',
    t1: '申訴',
    t2: '流程',
    href: '/story/complaint',
    title: '申訴流程',
  },
  {
    id: 3,
    img: 'icons/icon-report.svg',
    t1: '公評人',
    t2: '業務報告',
    href: '/story/reports',
    title: '公評人業務報告',
  },
  {
    id: 4,
    img: 'icons/icon-hammer.svg',
    t1: '外部公評人',
    t2: '設置章程',
    href: '/story/law',
    title: '外部公評人設置章程',
  },
  {
    id: 5,
    img: 'icons/icon-paper.svg',
    t1: '新聞自律 /',
    t2: '他律規範',
    href: '/story/standards',
    title: '新聞自律/他律規範',
  },
  {
    id: 6,
    img: 'icons/icon-question.svg',
    t1: '常見問題',
    t2: 'FAQ',
    href: '/story/faq',
    title: '常見問題FAQ',
  },
]

export default function IconLinkList() {
  return (
    <ol className={`${styles.infoList} ombuds__infolist`}>
      {infoList.map((info) => (
        <li key={info.id} className={styles.infoListItem}>
          <Link href={info.href} target="_blank" rel="noreferrer noopener">
            <div className={styles.iconWrapper}>
              <Image src={info.img} alt={info.title} width={22} height={22} />
            </div>
            <div className={styles.infoListTitle}>
              <p>{info.t1}</p>
              <p>{info.t2}</p>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  )
}

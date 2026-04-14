import errors from '@twreporter/errors'
import MobileNav from '~/components/layout/header/mobile-header/mobile-nav'
import { HEADER_FILENAME } from '~/constants/json-filenames'
import type { Category } from '~/graphql/query/category'
import type { Sponsor } from '~/graphql/query/sponsors'
import type { RawHeaderJson, RawShow, RawSponsor } from '~/types/header'
import { fetchStaticJson } from '~/utils/fetch-static-json'
import styles from './_styles/main-header.module.scss'
import HeaderBottom from './header-bottom'
import HeaderNav from './header-nav'
import HeaderTop from './header-top'

async function getData() {
  try {
    const data = await fetchStaticJson<RawHeaderJson>(HEADER_FILENAME)

    // Transform new JSON format { categories, shows, sponsors } to HeaderData format { allCategories, allShows, allSponsors }
    return {
      allCategories: data.categories || [],
      allShows: (data.shows || []).map((show: RawShow) => ({
        id: show.id,
        slug: show.slug,
        name: show.name,
        sortOrder: show.sortOrder,
        listShow: show.listShow,
        bannerImg: show.bannerImg
          ? {
              urlMobileSized:
                show.bannerImg.w800 || show.bannerImg.original || '',
              urlTabletSized:
                show.bannerImg.w800 || show.bannerImg.original || '',
              urlOriginal: show.bannerImg.original || '',
            }
          : null,
      })),
      allSponsors: (data.sponsors || []).map((sponsor: RawSponsor) => ({
        id: sponsor.id,
        title: sponsor.title ?? '',
        url: sponsor.url ?? '',
        logo: sponsor.logo
          ? {
              urlMobileSized: sponsor.logo.w480 || '',
            }
          : null,
        mobile: sponsor.mobile
          ? {
              urlMobileSized: sponsor.mobile.w480 || '',
            }
          : null,
        tablet: sponsor.tablet
          ? {
              urlMobileSized: sponsor.tablet.w480 || '',
            }
          : null,
        topic: sponsor.topic,
      })),
    }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching header data'
    )

    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(annotatingError, {
          withStack: false,
          withPayload: true,
        }),
      })
    )
    return { allSponsors: [], allCategories: [], allShows: [] }
  }
}

export default async function MainHeader() {
  let sponsorsData: Sponsor[] = []
  let categoriesData: Category[] = []

  const { allCategories = [], allSponsors = [] } = await getData()

  categoriesData = allCategories
  sponsorsData = allSponsors

  return (
    <header className={styles.header}>
      <div className={styles.pcHeaderWrapper}>
        <HeaderTop sponsors={sponsorsData} />
        <HeaderNav categories={categoriesData} />
        <HeaderBottom />
      </div>
      <div className={styles.mobHeaderWrapper}>
        <div className={styles.placeholder} />
        <MobileNav categories={categoriesData} sponsors={sponsorsData} />
      </div>
    </header>
  )
}

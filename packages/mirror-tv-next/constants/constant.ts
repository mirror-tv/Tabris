// 這裡管理固定數值
const SITE_TITLE: string = '鏡新聞'
const META_DESCRIPTION: string =
  '鏡電視股份有限公司創立「鏡新聞」，以多元、專業、深度、國際、藝文、弱勢為特色，期待提供給大家耳目一新的優質新聞內容，也歡迎閱聽人隨時給我們建議。'

const HEADER_BOTTOM_LINKS = {
  ombuds: '/ombuds',
  anchorperson: '/anchorperson',
  about: '/story/aboutus',
  fb: 'https://www.facebook.com/mnewstw',
  line: 'https://lin.ee/4XsO8xi',
  ig: 'https://www.instagram.com/mnewstw',
  x: 'https://twitter.com/mnews_tw',
}

const FILTERED_SLUG = [
  'privacy',
  'ad-sales',
  'press-self-regulation',
  'webauthorization',
  'aboutus',
]

//Custom Search JSON API
const URL_PROGRAMABLE_SEARCH = 'https://www.googleapis.com/customsearch/v1'

const HOMEPAGE_POSTS_PAGE_SIZE = 12

const SALES_LABEL_NAME = '特企'

export {
  HEADER_BOTTOM_LINKS,
  META_DESCRIPTION,
  SITE_TITLE,
  FILTERED_SLUG,
  URL_PROGRAMABLE_SEARCH,
  HOMEPAGE_POSTS_PAGE_SIZE,
  SALES_LABEL_NAME,
}

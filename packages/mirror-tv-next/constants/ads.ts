/**
 * GAM 版位目錄（adGeek 規格書 20260903 / 0828 琴宣更）
 *
 * 主鍵是規格「廣告單元名稱」。
 *   <GPTAd adUnit="mnews_article_sidebar_300x250_01" />
 */

type SingleSizeArray = [number, number]

type AdDevice = 'PC' | 'MB' | 'ALL'

type AdKind = 'display' | 'overlay' | 'anchor' | 'refresh'

type AdSlot = {
  adUnit: string
  gptDivId: string
  adSize: SingleSizeArray[]
  device: AdDevice
  /** null = overlay / sticky / 1x1，不佔文件流 */
  minHeight: number | null
  kind: AdKind
}

function slot(
  adUnit: string,
  gptDivId: string,
  adSize: SingleSizeArray[],
  device: AdDevice,
  minHeight: number | null,
  kind: AdKind = 'display'
): AdSlot {
  return { adUnit, gptDivId, adSize, device, minHeight, kind }
}

const AD_SLOTS = {
  // --- 全站 ---
  // PC/MB 全站
  mnews_refresh: slot(
    'mnews_refresh',
    'div-gpt-ad-1787553032294-0',
    [[1, 1]],
    'ALL',
    null,
    'refresh'
  ),
  // PC 全站 — navbar下方、編輯精選上方
  mnews_masthead_top_970x400: slot(
    'mnews_masthead_top_970x400',
    'div-gpt-ad-1787542814196-0',
    [
      [1, 1],
      [970, 250],
    ],
    'PC',
    255
  ),
  // MB 全站 — 錨底（延遲 1 分鐘）
  mnews_m_article_footer_320x50: slot(
    'mnews_m_article_footer_320x50',
    'div-gpt-ad-1787552984637-0',
    [
      [320, 100],
      [1, 1],
      [320, 50],
    ],
    'MB',
    null,
    'anchor'
  ),

  // --- 蓋版 MB ---
  // /category/{slug}
  mnews_m_320x480_category: slot(
    'mnews_m_320x480_category',
    'div-gpt-ad-1787552634406-0',
    [
      [1, 1],
      [320, 480],
    ],
    'MB',
    null,
    'overlay'
  ),
  // /story/{slug} /external/{slug}
  mnews_m_320x480_News: slot(
    'mnews_m_320x480_News',
    'div-gpt-ad-1787552707424-0',
    [
      [1, 1],
      [320, 480],
    ],
    'MB',
    null,
    'overlay'
  ),
  // homepage(/)
  mnews_m_320x480_Home: slot(
    'mnews_m_320x480_Home',
    'div-gpt-ad-1787552762298-0',
    [
      [1, 1],
      [320, 480],
    ],
    'MB',
    null,
    'overlay'
  ),
  // /show/{slug}
  mnews_m_320x480_program: slot(
    'mnews_m_320x480_program',
    'div-gpt-ad-1787552846236-0',
    [
      [1, 1],
      [320, 480],
    ],
    'MB',
    null,
    'overlay'
  ),
  // /category/video
  mnews_m_320x480_video: slot(
    'mnews_m_320x480_video',
    'div-gpt-ad-1787552903188-0',
    [
      [1, 1],
      [320, 480],
    ],
    'MB',
    null,
    'overlay'
  ),

  // --- 首頁 homepage(/) ---
  // PC — 即時新聞下方、發燒單元上方
  mnews_home_900x280: slot(
    'mnews_home_900x280',
    'div-gpt-ad-1787544033326-0',
    [
      [900, 280],
      [970, 250],
      [970, 90],
    ],
    'PC',
    285
  ),
  // MB — navbar以下，快訊以上
  mnews_m_home_300x250_01: slot(
    'mnews_m_home_300x250_01',
    'div-gpt-ad-1787544206026-0',
    [
      [336, 280],
      [1, 1],
      [300, 250],
    ],
    'MB',
    285
  ),
  // MB — 鏡新聞Live以下，個人廣告banner以上
  mnews_m_home_300x250_02: slot(
    'mnews_m_home_300x250_02',
    'div-gpt-ad-1787544320702-0',
    [
      [300, 250],
      [336, 280],
    ],
    'MB',
    285
  ),
  // MB — 熱門新聞以下、發燒單元以上
  mnews_m_home_300x250_03: slot(
    'mnews_m_home_300x250_03',
    'div-gpt-ad-1787544389191-0',
    [
      [336, 280],
      [300, 250],
    ],
    'MB',
    285
  ),
  // MB — 節目以下、推薦專題以上
  mnews_m_home_300x250_04: slot(
    'mnews_m_home_300x250_04',
    'div-gpt-ad-1787544451134-0',
    [
      [336, 280],
      [300, 250],
    ],
    'MB',
    285
  ),

  // --- 文章 / 外部稿 /story /external ---
  // PC — 側邊欄即時新聞上方
  mnews_article_sidebar_300x250_01: slot(
    'mnews_article_sidebar_300x250_01',
    'div-gpt-ad-1787544555043-0',
    [[300, 250]],
    'PC',
    255
  ),
  // PC — 側邊欄即時新聞下方、熱門新聞上方
  mnews_article_sidebar_300x250_02: slot(
    'mnews_article_sidebar_300x250_02',
    'div-gpt-ad-1787544651317-0',
    [[300, 250]],
    'PC',
    255
  ),
  // PC — 側邊欄熱門新聞下方（最底部）
  mnews_article_sidebar_300x250_03: slot(
    'mnews_article_sidebar_300x250_03',
    'div-gpt-ad-1787544731278-0',
    [[300, 250]],
    'PC',
    255
  ),
  // PC — Gila Studio（CLS 例外 350；依 <p> 數插入）
  mnews_article_middle_1: slot(
    'mnews_article_middle_1',
    'div-gpt-ad-1787545592411-0',
    [
      [1, 1],
      [300, 250],
    ],
    'PC',
    350
  ),
  // PC — 文內 300x250（依 <p> 數插入）
  mnews_article_middle_300x250_01: slot(
    'mnews_article_middle_300x250_01',
    'div-gpt-ad-1787545786947-0',
    [
      [1, 1],
      [300, 250],
    ],
    'PC',
    255
  ),
  // PC — 錨底 1x1
  mnews_article_footer: slot(
    'mnews_article_footer',
    'div-gpt-ad-1787546114278-0',
    [[1, 1]],
    'PC',
    null,
    'anchor'
  ),
  // MB — 文章首圖上方
  mnews_m_article_top_300x250: slot(
    'mnews_m_article_top_300x250',
    'div-gpt-ad-1787546245247-0',
    [[300, 250]],
    'MB',
    255
  ),
  // MB — Gila Studio（CLS 例外 185；依 <p> 數插入）
  mnews_m_article_middle_1: slot(
    'mnews_m_article_middle_1',
    'div-gpt-ad-1787546347030-0',
    [
      [1, 1],
      [300, 250],
    ],
    'MB',
    185
  ),
  // MB — 文內 300x250（依 <p> 數插入）
  mnews_m_article_middle_300x250: slot(
    'mnews_m_article_middle_300x250',
    'div-gpt-ad-1787546618894-0',
    [
      [1, 1],
      [300, 250],
    ],
    'MB',
    255
  ),

  // --- 分類 /category/{slug} ---
  // PC — 熱門新聞上方
  mnews_category_sidebar_300x250_01: slot(
    'mnews_category_sidebar_300x250_01',
    'div-gpt-ad-1787546784999-0',
    [[300, 250]],
    'PC',
    255
  ),
  // PC — 熱門新聞下方、即時新聞上方
  mnews_category_sidebar_300x250_02: slot(
    'mnews_category_sidebar_300x250_02',
    'div-gpt-ad-1787546873812-0',
    [[300, 250]],
    'PC',
    255
  ),
  // PC — 看更多按鈕下方（需修復跑版）
  mnews_category_900x280: slot(
    'mnews_category_900x280',
    'div-gpt-ad-1787546945835-0',
    [[900, 280]],
    'PC',
    285
  ),
  // MB — navbar下方
  mnews_m_category_top_300x250: slot(
    'mnews_m_category_top_300x250',
    'div-gpt-ad-1787547026498-0',
    [
      [336, 280],
      [300, 250],
    ],
    'MB',
    285
  ),
  // MB — 看更多按鈕下方，熱門新聞上方
  mnews_m_category_middle_300x250: slot(
    'mnews_m_category_middle_300x250',
    'div-gpt-ad-1787551308862-0',
    [
      [1, 1],
      [300, 250],
      [320, 480],
      [336, 280],
    ],
    'MB',
    485
  ),
  // MB — 即時新聞下方，footer上方
  mnews_m_category_end_300x250_04: slot(
    'mnews_m_category_end_300x250_04',
    'div-gpt-ad-1787551385053-0',
    [
      [336, 280],
      [300, 250],
    ],
    'MB',
    285
  ),

  // --- 影音 /category/video ---
  // PC — 側邊欄發燒單元上方
  mnews_video_sidebar_300x250_01: slot(
    'mnews_video_sidebar_300x250_01',
    'div-gpt-ad-1787551458435-0',
    [[300, 250]],
    'PC',
    255
  ),
  // PC — 側邊欄發燒單元下方，節目上方（第一個）
  mnews_video_sidebar_300x250_02: slot(
    'mnews_video_sidebar_300x250_02',
    'div-gpt-ad-1787551558083-0',
    [[300, 250]],
    'PC',
    255
  ),
  // PC — 側邊欄發燒單元下方，節目上方（第二個）
  mnews_video_sidebar_300x600_03: slot(
    'mnews_video_sidebar_300x600_03',
    'div-gpt-ad-1787551683428-0',
    [[300, 600]],
    'PC',
    605
  ),
  // PC — 熱門影音下方、第一個分類影音上方（需修復跑版）
  mnews_video_900x280: slot(
    'mnews_video_900x280',
    'div-gpt-ad-1787551749517-0',
    [[900, 280]],
    'PC',
    285
  ),
  // MB — navbar下方
  mnews_m_video_300x250_01: slot(
    'mnews_m_video_300x250_01',
    'div-gpt-ad-1787551821450-0',
    [
      [300, 250],
      [336, 280],
    ],
    'MB',
    285
  ),
  // MB — 熱門影音下方、第一個分類影音上方（需修復跑版）
  mnews_m_video_300x250_03: slot(
    'mnews_m_video_300x250_03',
    'div-gpt-ad-1787552058634-0',
    [
      [336, 280],
      [300, 250],
    ],
    'MB',
    285
  ),
  // MB — 第三個分類影音下方、第四個分類影音上方
  mnews_m_video_300x250_04: slot(
    'mnews_m_video_300x250_04',
    'div-gpt-ad-1787552115210-0',
    [
      [300, 250],
      [336, 280],
    ],
    'MB',
    285
  ),

  // --- 節目 /show/{slug} ---
  // MB — navbar下方
  mnews_m_program_top_300x250: slot(
    'mnews_m_program_top_300x250',
    'div-gpt-ad-1787552178332-0',
    [
      [300, 250],
      [336, 280],
    ],
    'MB',
    285
  ),
  // MB — 主持人資訊下方
  mnews_m_program_middle_300x250: slot(
    'mnews_m_program_middle_300x250',
    'div-gpt-ad-1787552264522-0',
    [
      [300, 250],
      [336, 280],
    ],
    'MB',
    285
  ),
  // MB — footer上方
  mnews_m_program_end_300x250_04: slot(
    'mnews_m_program_end_300x250_04',
    'div-gpt-ad-1787552328875-0',
    [
      [300, 250],
      [336, 280],
    ],
    'MB',
    285
  ),
  // PC — 側邊欄第一個
  mnews_program_sidebar_300x250_01: slot(
    'mnews_program_sidebar_300x250_01',
    'div-gpt-ad-1787552394731-0',
    [[300, 250]],
    'PC',
    255
  ),
  // PC — 側邊欄第二個
  mnews_program_sidebar_300x250_02: slot(
    'mnews_program_sidebar_300x250_02',
    'div-gpt-ad-1787552457355-0',
    [[300, 250]],
    'PC',
    255
  ),
  // PC — 側邊欄第三個
  mnews_program_sidebar_300x600_03: slot(
    'mnews_program_sidebar_300x600_03',
    'div-gpt-ad-1787552513138-0',
    [[300, 600]],
    'PC',
    605
  ),
  // PC — 看更多按鈕下方
  mnews_program_900x280: slot(
    'mnews_program_900x280',
    'div-gpt-ad-1787552566059-0',
    [[900, 280]],
    'PC',
    285
  ),
} as const satisfies Record<string, AdSlot>

type AdUnitName = keyof typeof AD_SLOTS

function getAdSlot(adUnit: string): AdSlot | undefined {
  return AD_SLOTS[adUnit as AdUnitName]
}

const GPT_AD_NETWORK = '22699107359'

const mediaSize = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1440,
}

export { AD_SLOTS, GPT_AD_NETWORK, getAdSlot, mediaSize }
export type { AdDevice, AdKind, AdSlot, AdUnitName, SingleSizeArray }

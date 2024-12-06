/**
 * page key（比如 global、[news]）註解中各項文字代表的涵義：
 * // page key: spreadsheet 的「分類」欄位, spreadsheet 的「section」欄位
 */

/**
 * ad key（比如 RWD_LOGO、MB_HD）是怎麼決定的：spreadsheet 的「device」欄位_spreadsheet 的「position」欄位
 *
 * 構建 ad key 的程式碼如下：
 * const adKey = [
 *   device === 'm' ? 'MB' : device.toUpperCase(),
 *   position.toUpperCase(),
 * ].join('_')
 */

// Define GPT_UNITS type
type SingleSizeArray = [number, number]
interface GPTUnits {
  [pageKey: string]: {
    [adKey: string]: {
      adUnit: string
      adSize: SingleSizeArray[]
    }
  }
}
const GPT_UNITS: GPTUnits = {
  // page key: fs，蓋版廣告
  fs: {
    // ad key
    MB_HOME: {
      adUnit: 'mnews_m_320x480_Home',
      adSize: [
        [320, 480],
        [1, 1],
      ],
    },
    MB_CATEGORY: {
      adUnit: 'mnews_m_320x480_category',
      adSize: [
        [320, 480],
        [1, 1],
      ],
    },
    MB_NEWS: {
      adUnit: 'mnews_m_320x480_News',
      adSize: [
        [320, 480],
        [1, 1],
      ],
    },
    MB_PROGRAM: {
      adUnit: 'mnews_m_320x480_program',
      adSize: [
        [320, 480],
        [1, 1],
      ],
    },
    MB_VIDEO: {
      adUnit: 'mnews_m_320x480_video',
      adSize: [
        [320, 480],
        [1, 1],
      ],
    },
  },
  // page key: all，全站
  all: {
    PC_HD: {
      adUnit: 'mnews_masthead_top_970x400',
      adSize: [
        [970, 400],
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },
  // page key: home，首頁
  home: {
    // ad key
    PC_BT: {
      adUnit: 'mnews_home_900x280',
      adSize: [
        [900, 280],
        [1, 1],
      ],
    },
    PC_BT2: {
      adUnit: 'mnews_home_middle_900x280',
      adSize: [
        [900, 280],
        [1, 1],
      ],
    },
    MB_M1: {
      adUnit: 'mnews_m_home_300x250_01',
      adSize: [
        [300, 250],
        [336, 280],
        [1, 1],
      ],
    },
    MB_M2: {
      adUnit: 'mnews_m_home_300x250_02',
      adSize: [
        [300, 250],
        [336, 280],
        [320, 480],
        [1, 1],
      ],
    },
    MB_M3: {
      adUnit: 'mnews_m_home_300x250_03',
      adSize: [
        [300, 250],
        [336, 280],
        [1, 1],
      ],
    },
    MB_M4: {
      adUnit: 'mnews_m_home_300x250_04',
      adSize: [
        [300, 250],
        [336, 280],
        [1, 1],
      ],
    },
  },
  // page key: story，文章頁
  story: {
    // ad key
    PC_R1: {
      adUnit: 'mnews_article_sidebar_300x250_01',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mnews_article_sidebar_300x250_02',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_R3: {
      adUnit: 'mnews_article_sidebar_300x250_03',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mnews_article_middle_300x250_01',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mnews_article_end_left_300x250',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mnews_article_end_right_300x250',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    MB_M1: {
      adUnit: 'mnews_m_article_top_300x250',
      adSize: [
        [300, 250],
        [336, 280],
        [1, 1],
      ],
    },
    MB_M2: {
      adUnit: 'mnews_m_article_middle_300x250',
      adSize: [
        [300, 250],
        [336, 280],
        [320, 480],
        [1, 1],
      ],
    },
    MB_M3: {
      adUnit: 'mnews_m_article_end_300x250_04',
      adSize: [
        [300, 250],
        [336, 280],
        [1, 1],
      ],
    },
  },
  // page key: category，分類頁
  category: {
    // ad key
    PC_R1: {
      adUnit: 'mnews_category_sidebar_300x250_01',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mnews_category_sidebar_300x250_02',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_BT: {
      adUnit: 'mnews_category_900x280',
      adSize: [
        [900, 280],
        [1, 1],
      ],
    },
    MB_M1: {
      adUnit: 'mnews_m_category_top_300x250',
      adSize: [
        [300, 250],
        [336, 280],
        [1, 1],
      ],
    },
    MB_M2: {
      adUnit: 'mnews_m_category_middle_300x250',
      adSize: [
        [300, 250],
        [336, 280],
        [320, 480],
        [1, 1],
      ],
    },
    MB_M3: {
      adUnit: 'mnews_m_category_end_300x250_04',
      adSize: [
        [300, 250],
        [336, 280],
        [1, 1],
      ],
    },
  },
  // page key: video，影音頁
  video: {
    // ad key
    PC_R1: {
      adUnit: 'mnews_video_sidebar_300x250_01',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mnews_video_sidebar_300x250_02',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_R3: {
      adUnit: 'mnews_video_sidebar_300x600_03',
      adSize: [
        [300, 600],
        [1, 1],
      ],
    },
    PC_BT: {
      adUnit: 'mnews_video_900x280',
      adSize: [
        [900, 280],
        [1, 1],
      ],
    },
    MB_M1: {
      adUnit: 'mnews_m_video_300x250_01',
      adSize: [
        [300, 250],
        [336, 280],
        [1, 1],
      ],
    },
    MB_M2: {
      adUnit: 'mnews_m_video_300x250_02',
      adSize: [
        [300, 250],
        [336, 280],
        [320, 480],
        [1, 1],
      ],
    },
    MB_M3: {
      adUnit: 'mnews_m_video_300x250_03',
      adSize: [
        [300, 250],
        [336, 280],
        [1, 1],
      ],
    },
    MB_M4: {
      adUnit: 'mnews_m_video_300x250_04',
      adSize: [
        [300, 250],
        [336, 280],
        [1, 1],
      ],
    },
  },
  // page key: show，節目頁
  show: {
    // ad key
    PC_R1: {
      adUnit: 'mnews_program_sidebar_300x250_01',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mnews_program_sidebar_300x250_02',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_R3: {
      adUnit: 'mnews_program_sidebar_300x600_03',
      adSize: [
        [300, 600],
        [1, 1],
      ],
    },
    PC_BT: {
      adUnit: 'mnews_program_900x280',
      adSize: [
        [900, 280],
        [1, 1],
      ],
    },
    MB_M1: {
      adUnit: 'mnews_m_program_top_300x250',
      adSize: [
        [300, 250],
        [336, 280],
        [1, 1],
      ],
    },
    MB_M2: {
      adUnit: 'mnews_m_program_middle_300x250',
      adSize: [
        [300, 250],
        [336, 280],
        [320, 480],
        [1, 1],
      ],
    },
    MB_M3: {
      adUnit: 'mnews_m_program_end_300x250_04',
      adSize: [
        [300, 250],
        [336, 280],
        [1, 1],
      ],
    },
  },
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

export { GPT_AD_NETWORK, GPT_UNITS, mediaSize }

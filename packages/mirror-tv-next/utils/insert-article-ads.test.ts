import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  ARTICLE_INLINE_AD,
  insertAdsIntoApiData,
  splitHtmlWithArticleAds,
} from './insert-article-ads'

type TestBlock = {
  id: string
  type: string
  content: unknown
  alignment?: string
}

function textBlock(id: string, html: string): TestBlock {
  return {
    id,
    type: 'unstyled',
    content: [html],
    alignment: 'center',
  }
}

function imageBlock(id: string): TestBlock {
  return {
    id,
    type: 'image',
    content: [],
    alignment: 'center',
  }
}

function adPairs(blocks: TestBlock[]) {
  return blocks
    .filter((block) => block.type === 'gpt-ad')
    .map((block) => block.content)
}

function adIndex(blocks: TestBlock[], pair: string) {
  return blocks.findIndex(
    (block) => block.type === 'gpt-ad' && block.content === pair
  )
}

describe('insertAdsIntoApiData', () => {
  it('p=0: 不插 Gila，文末 300x250', () => {
    const result = insertAdsIntoApiData([
      imageBlock('img-1'),
      textBlock('empty', '   <br>  '),
    ])
    assert.deepEqual(adPairs(result), [ARTICLE_INLINE_AD.mid])
    assert.equal(result.at(-1)?.content, ARTICLE_INLINE_AD.mid)
  })

  it('p=1: P1 後 Gila，300x250 在文末', () => {
    const result = insertAdsIntoApiData([
      imageBlock('img-1'),
      textBlock('p1', '<p>第一段</p>'),
      imageBlock('img-2'),
    ])
    const p1 = result.findIndex((block) => block.id === 'p1')
    assert.equal(result[p1 + 1]?.content, ARTICLE_INLINE_AD.gila)
    assert.equal(result.at(-1)?.content, ARTICLE_INLINE_AD.mid)
    assert.equal(result[p1 + 2]?.id, 'img-2')
  })

  it('p=2: P1 後 Gila，P2 後 300x250', () => {
    const result = insertAdsIntoApiData([
      textBlock('p1', '第一段'),
      imageBlock('img-1'),
      textBlock('p2', '第二段'),
    ])
    const gilaAt = adIndex(result, ARTICLE_INLINE_AD.gila)
    const midAt = adIndex(result, ARTICLE_INLINE_AD.mid)
    assert.equal(result[gilaAt - 1]?.id, 'p1')
    assert.equal(result[midAt - 1]?.id, 'p2')
    assert.ok(gilaAt < midAt)
  })

  it('p=10: 只插在前兩段文字後', () => {
    const blocks = Array.from({ length: 10 }, (_, i) =>
      textBlock(`p${i + 1}`, `段落 ${i + 1}`)
    )
    const result = insertAdsIntoApiData(blocks)
    assert.deepEqual(adPairs(result), [
      ARTICLE_INLINE_AD.gila,
      ARTICLE_INLINE_AD.mid,
    ])
    assert.equal(result[1]?.content, ARTICLE_INLINE_AD.gila)
    assert.equal(result[3]?.content, ARTICLE_INLINE_AD.mid)
    assert.equal(result.filter((block) => block.id.startsWith('p')).length, 10)
  })
})

describe('splitHtmlWithArticleAds', () => {
  it('p=0: 文末 300x250', () => {
    const parts = splitHtmlWithArticleAds(
      '<figure><img src="a.jpg" /></figure>'
    )
    assert.deepEqual(
      parts.map((part) => (part.type === 'ad' ? part.pair : 'html')),
      ['html', ARTICLE_INLINE_AD.mid]
    )
  })

  it('p=1: P1 後 Gila，300x250 在文末', () => {
    const parts = splitHtmlWithArticleAds('<p>只有一段</p><img src="a.jpg" />')
    assert.deepEqual(
      parts.map((part) => (part.type === 'ad' ? part.pair : part.html)),
      [
        '<p>只有一段</p>',
        ARTICLE_INLINE_AD.gila,
        '<img src="a.jpg" />',
        ARTICLE_INLINE_AD.mid,
      ]
    )
  })

  it('p=2: P1 後 Gila，P2 後 300x250', () => {
    const parts = splitHtmlWithArticleAds(
      '<p>第一段</p><img src="a.jpg" /><p>第二段</p><p>第三段</p>'
    )
    assert.deepEqual(
      parts.map((part) => (part.type === 'ad' ? part.pair : part.html)),
      [
        '<p>第一段</p>',
        ARTICLE_INLINE_AD.gila,
        '<img src="a.jpg" /><p>第二段</p>',
        ARTICLE_INLINE_AD.mid,
        '<p>第三段</p>',
      ]
    )
  })

  it('p=10: 只插在前兩段文字後', () => {
    const html = Array.from(
      { length: 10 },
      (_, i) => `<p>段落 ${i + 1}</p>`
    ).join('')
    const parts = splitHtmlWithArticleAds(html)
    const ads = parts.filter((part) => part.type === 'ad')
    assert.equal(ads.length, 2)
    assert.equal(
      ads[0].type === 'ad' ? ads[0].pair : '',
      ARTICLE_INLINE_AD.gila
    )
    assert.equal(ads[1].type === 'ad' ? ads[1].pair : '', ARTICLE_INLINE_AD.mid)
  })

  it('空 p 與只有圖片的 p 不算一段', () => {
    const parts = splitHtmlWithArticleAds(
      '<p> </p><p><img src="a.jpg" /></p><p>真正的文字</p>'
    )
    assert.deepEqual(
      parts.filter((part) => part.type === 'ad').map((part) => part.pair),
      [ARTICLE_INLINE_AD.gila, ARTICLE_INLINE_AD.mid]
    )
  })

  it('外層 wrapper 被切開時改文末單格，不切壞 DOM', () => {
    const html =
      '<div class="content"><p>第一段</p><p>第二段</p><p>第三段</p></div>'
    const parts = splitHtmlWithArticleAds(html)
    assert.deepEqual(
      parts.map((part) => (part.type === 'ad' ? part.pair : part.html)),
      [html, ARTICLE_INLINE_AD.mid]
    )
  })

  it('段與段之間完整的 div 仍正常切割', () => {
    const parts = splitHtmlWithArticleAds(
      '<p>第一段</p><div class="box">圖說</div><p>第二段</p><p>第三段</p>'
    )
    assert.deepEqual(
      parts.map((part) => (part.type === 'ad' ? part.pair : part.html)),
      [
        '<p>第一段</p>',
        ARTICLE_INLINE_AD.gila,
        '<div class="box">圖說</div><p>第二段</p>',
        ARTICLE_INLINE_AD.mid,
        '<p>第三段</p>',
      ]
    )
  })

  it('未閉合的 inline tag 不觸發退回', () => {
    const parts = splitHtmlWithArticleAds(
      '<p>第一段<span>未閉合</p><p>第二段</p>'
    )
    assert.deepEqual(
      parts.filter((part) => part.type === 'ad').map((part) => part.pair),
      [ARTICLE_INLINE_AD.gila, ARTICLE_INLINE_AD.mid]
    )
  })
})

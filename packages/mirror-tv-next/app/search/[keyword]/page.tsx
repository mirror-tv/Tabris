'use client'
import { useEffect } from 'react'
import { formateDateAtTaipei } from '~/utils/date-handler'
import { MISO_API_KEY } from '~/constants/config'
import { useParams, useRouter } from 'next/navigation'
import { GPTPlaceholderDesktop } from '~/components/ads/gpt/gpt-placeholder'
import GptAd from '~/components/ads/gpt/gpt-ad'

export default function MisoSearch() {
  const params = useParams()
  const router = useRouter()
  const keyword = (params?.keyword as string) || ''
  console.log({ keyword })
  const sortOptions = [
    { field: 'relevance', text: '關聯性', default: true },
    { field: 'published_at', text: '由新到舊' },
  ]
  useEffect(() => {
    if (!keyword) return
    console.log({ keyword })

    const misocmd = window.misocmd || (window.misocmd = [])
    misocmd.push(async () => {
      // setup client
      const MisoClient = window.MisoClient
      const client = new MisoClient(MISO_API_KEY)
      const workflow = client.ui.hybridSearch

      const apiConfig = {
        fq: 'product_id:/mirrortv_.+/',
        source_fl: [
          'cover_image',
          'url',
          'created_at',
          'updated_at',
          'published_at',
          'title',
        ],
        fl: [
          'cover_image',
          'url',
          'created_at',
          'updated_at',
          'published_at',
          'title',
        ],
        snippet_max_chars: 0,
        sort: 'relevance',
      }

      workflow.useApi(apiConfig)
      workflow.useLayouts({
        query: {
          placeholder: 'Ask anything!',
        },
        products: [
          'list',
          {
            templates: {
              product: renderProduct,
            },
          },
        ],
      })
      workflow.useFilters({
        sort: {
          options: sortOptions,
        },
      })

      interface Product {
        id: string | number
        url: string
        cover_image: string
        title: string
        published_at: string | Date
      }

      function highlightKeyword(text: string, keyword: string): string {
        if (!keyword || !text) return text

        const regex = new RegExp(
          `(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
          'gi'
        )

        return text.replace(regex, '<span class="keyword">$1</span>')
      }

      function renderProduct(
        layout: object,
        state: object,
        product: Product
      ): string {
        const currentQuery = keyword

        const html = `
          <a class="miso-list__item-body" data-role="item" data-miso-product-id="${
            product.id
          }" href="${
          product.url
        }" target="_blank" rel="noopener" style="gap: 0 0 !important;">
            <div class="miso-list__item-cover-image-container">
              <img class="miso-list__item-cover-image" src="${
                product.cover_image
              }">
            </div>
            <div class="miso-list__item-info-container">
              <div class="miso-list__item-title">${highlightKeyword(
                product.title,
                currentQuery
              )}</div>
              <div class='miso-list__item-time'>${
                product['published_at']?.toString()
                  ? formateDateAtTaipei(
                      new Date(product['published_at'] ?? ''),
                      'YYYY.MM.DD HH:mm',
                      ''
                    )
                  : ''
              }</div>
            </div>
         </a>
       `
        return html
      }
      // wait for styles to be loaded
      await client.ui.ready

      // render DOM and get element references
      const defaults = MisoClient.ui.defaults.hybridSearch
      let templates = defaults.templates.root({ answerBox: true })
      function insertElement(html: string) {
        html = html.replace(
          '<miso-facets></miso-facets>',
          // eslint-disable-next-line tailwindcss/no-custom-classname
          `
          <div class="miso-hybrid-search-combo__search-results-filters__right">
            <div class="miso-hybrid-search-combo__search-results-filters__sort-header">排序依</div>
            <miso-sort style="display: none;"></miso-sort>
            <div class="miso-hybrid-search-combo__search-results-filters__sort-options-container">
            ${sortOptions
              .map((sortItem) => {
                return `<button class="miso-hybrid-search-combo__search-results-filters__sort-option" data-field="${sortItem.field}" key="${sortItem.field}">${sortItem.text}</button>`
              })
              .join('')}
            </div>
          </div>`
        )
        return html
      }
      templates = insertElement(templates)
      const wireAnswerBox = defaults.wireAnswerBox

      const rootElement = document.querySelector('#miso-hybrid-search-combo')
      if (rootElement) rootElement.innerHTML = templates

      wireAnswerBox(client, rootElement)

      // answer box toggle button text
      const handleToggleButtonText = () => {
        const toggleButton = rootElement?.querySelector(
          '.miso-hybrid-search-combo__answer-box-toggle'
        )
        if (toggleButton) {
          toggleButton.textContent = '查看更多'
          toggleButton.addEventListener('click', () => {
            setTimeout(() => {
              const isExpanded =
                rootElement?.classList.contains(
                  'miso-hybrid-search-combo__answer-box-open'
                ) ||
                rootElement?.querySelector(
                  '.miso-hybrid-search-combo__answer-box-open'
                )

              if (isExpanded) {
                toggleButton.textContent = '收合全部'
              } else {
                toggleButton.textContent = '展開更多'
              }
            }, 100)
          })
        }
      }

      // 排序按鈕事件監聽器
      const handleSortButtons = () => {
        const sortButtons = rootElement?.querySelectorAll(
          '.miso-hybrid-search-combo__search-results-filters__sort-option'
        )

        // 設置默認選中的排序選項
        const defaultSortOption = sortOptions.find((option) => option.default)
        if (defaultSortOption) {
          const defaultButton = rootElement?.querySelector(
            `[data-field="${defaultSortOption.field}"]`
          )
          defaultButton?.classList.add('active')
        }

        sortButtons?.forEach((button) => {
          button.addEventListener('click', (e) => {
            const target = e.target as HTMLElement
            const field = target.getAttribute('data-field')

            // 移除所有按鈕的 active 狀態
            sortButtons.forEach((btn) => {
              btn.classList.remove('active')
            })

            // 添加當前按鈕的 active 狀態
            target.classList.add('active')

            // 觸發排序 - 通過隱藏的 miso-sort 元素
            if (field) {
              // 找到隱藏的 miso-sort 元素
              const misoSortElement = rootElement?.querySelector('miso-sort')
              if (misoSortElement) {
                // 找到 miso-sort 內部的選擇按鈕
                const misoSortButton = misoSortElement.querySelector(
                  '.miso-select__button'
                ) as HTMLElement
                if (misoSortButton) {
                  // 點擊 miso-sort 按鈕打開選項
                  misoSortButton.click()

                  // 等待選項出現後選擇對應的選項
                  setTimeout(() => {
                    const misoSortOptions = misoSortElement.querySelectorAll(
                      '.miso-select__option'
                    )
                    misoSortOptions.forEach((option) => {
                      const optionText = option.textContent?.trim()
                      const sortOption = sortOptions.find(
                        (opt) => opt.text === optionText
                      )
                      if (sortOption && sortOption.field === field) {
                        // 點擊對應的選項
                        ;(option as HTMLElement).click()
                      }
                    })
                  }, 100)
                }
              }
            }
          })
        })
      }

      setTimeout(() => {
        handleToggleButtonText()
        handleSortButtons()
      }, 100)

      setTimeout(() => {
        workflow.query({ q: keyword })
      }, 1000)

      workflow.answer.on('request', ({ payload: { q } }) => {
        router.push(`/search/${q}`)
      })
    })
  }, [keyword])
  return (
    <>
      <GPTPlaceholderDesktop>
        <p>廣告</p>
        <GptAd pageKey="all" adKey="PC_HD" />
      </GPTPlaceholderDesktop>
      <div
        id="miso-hybrid-search-combo"
        className="miso-hybrid-search-combo"
      ></div>
    </>
  )
}

// 這裡管理的是在 runtime 時，可被設定的環境變數 (通常沒有 `NEXT_PUBLIC_` 作為開頭)
const API_ENDPOINT =
  process.env.API_ENDPOINT ?? 'https://api-dev.mnews.tw/admin/api'
const PROGRAMMABLE_SEARCH_API_KEY = process.env.PROGRAMMABLE_SEARCH_API_KEY
const PROGRAMMABLE_SEARCH_ENGINE_ID = process.env.PROGRAMMABLE_SEARCH_ENGINE_ID

export {
  API_ENDPOINT,
  PROGRAMMABLE_SEARCH_API_KEY,
  PROGRAMMABLE_SEARCH_ENGINE_ID,
}

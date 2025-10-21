# Member 驗證設定

## 環境變數設定

在 `.env.local` 檔案中加入以下設定：

```bash
# JWT 金鑰（必填）
JWT_SECRET=your_super_secret_key_for_jwt_signing

# CMS GraphQL API 設定（必填）
# 注意：lib/env.ts 中的預設值為示例 URL，實際無法使用
# 請聯繫專案負責人取得正確的 API URL
GQL_ENDPOINT=https://your-actual-cms-api-url.com/api/graphql
```

**⚠️ 重要提醒**：

- `lib/env.ts` 中的預設 `GQL_ENDPOINT` 是示例 URL（`https://your-cms-api.example.com/api/graphql`）
- **開發前必須在 `.env.local` 中設定真實的 CMS API URL**
- `.env.local` 已在 `.gitignore` 中，不會被提交到 repository
- 請聯繫專案負責人取得正確的 API endpoint
- 不需要設定 API Key，因為目前的 CMS API 不需要認證

## 運作方式

無論開發或正式環境：

- 使用 `lib/env.ts` 中設定的 `GQL_ENDPOINT`
- 可以透過環境變數 `GQL_ENDPOINT` 覆寫預設值
- 會實際呼叫 CMS GraphQL API 查詢 member 資料
- 只有 `state` 為 `active` 的會員才能通過驗證
- 如果 member 不存在或非啟用狀態，會回傳錯誤訊息阻止登入

**注意**：系統會實際查詢 CMS，請確保 CMS API 可正常連線。

## CMS GraphQL Schema

系統使用以下 GraphQL 查詢介面：

### 查詢 Member

```graphql
query GetMembers($where: MemberWhereInput) {
  members(where: $where) {
    id
    firebaseID
    email
    name
    mobile
    state
  }
}
```

### 查詢條件範例

**Email 查詢**：

```json
{
  "where": {
    "email": { "equals": "user@example.com" },
    "state": { "equals": "active" }
  }
}
```

**手機號碼查詢**：

```json
{
  "where": {
    "mobile": { "equals": "0912345678" },
    "state": { "equals": "active" }
  }
}
```

**注意**：只會查詢 `state` 為 `active` 的會員。

## 錯誤訊息

- **Email 不存在**: "請輸入您註冊應援科技使用的電子信箱"
- **手機號碼不存在**: "請輸入您註冊應援科技使用的手機號碼"
- **系統錯誤**: "系統錯誤，請稍後再試"

錯誤訊息會顯示在對應的輸入框下方。

## 自訂設定

### 修改 API URL

**⚠️ 安全提醒**：

- 真實的 API URL 已在 `lib/env.ts` 中設定
- 請勿在公開文件或 repository 中暴露真實 URL
- 如需覆寫，請在 `.env.local` 中設定（該檔案不會被 commit 到 git）

在 `.env.local` 中覆寫：

```bash
GQL_ENDPOINT=https://your-actual-api-url.com/api/graphql
```

### 修改查詢邏輯

如果需要修改 CMS API 的查詢邏輯，請編輯：

- `utils/member.ts` - Member 驗證服務

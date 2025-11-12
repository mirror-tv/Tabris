'use client'

import { ReactNode, useState } from 'react'

import { CustomInput } from '@/components/custom-ui/custom-input'
import { LabeledField } from '@/components/custom-ui/labeled-field'
import PageHeader from '@/components/shared/page-header'
import PageMain from '@/components/shared/page-main'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// Taiwan ID validation
function validateTaiwanId(id: string): boolean {
  const idPattern = /^[A-Z][12]\d{8}$/
  if (!idPattern.test(id)) return false

  const regionLetterMapping = 'ABCDEFGHJKLMNPQRSTUVXYWZIO'
  const firstLetter = id[0]
  const regionIndex = regionLetterMapping.indexOf(firstLetter)
  if (regionIndex === -1) return false

  const regionNumericCode = regionIndex + 10
  const regionCodeDigits = [
    Math.floor(regionNumericCode / 10),
    regionNumericCode % 10,
  ]
  const idNumberDigits = id.slice(1).split('').map(Number)

  const allDigits = [...regionCodeDigits, ...idNumberDigits]

  const weightFactors = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1]

  const weightedSum = allDigits.reduce(
    (sum, digit, index) => sum + digit * weightFactors[index],
    0
  )

  return weightedSum % 10 === 0
}

// ===== Label / Input Element IDs =====
const idLabelId = 'id-number-label'
const addressLabelId = 'address-label'

const ulStyle = 'list-disc pl-5 text-text-secondary marker:text-xs'

export default function IdentityInfo() {
  const [idNumber, setIdNumber] = useState('')
  const [address, setAddress] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!idNumber.trim()) newErrors.idNumber = '請輸入身分證字號'
    else if (!validateTaiwanId(idNumber.trim().toUpperCase()))
      newErrors.idNumber = '身分證字號格式不正確'

    if (!address.trim()) newErrors.address = '請輸入完整戶籍地址'

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    console.log('Form submitted:', { idNumber, address })
  }
  return (
    <>
      <PageHeader variant="centered" />
      <PageMain className="space-y-xl py-5 md:space-y-3xl md:py-10 xl:space-y-4xl">
        <form onSubmit={handleSubmit}>
          <Card className="mx-auto max-w-100 gap-4">
            <CardHeader className="text-center">
              <CardTitle asChild>
                <h3>身份驗證</h3>
              </CardTitle>
              <CardDescription>
                您提供的資訊僅作為鏡新聞個人廣告平台會員資訊使用，本公司不會將個人資料提供予第三方
              </CardDescription>
            </CardHeader>
            <CardContent className="mb-4 space-y-4xl">
              {/* ID */}
              <LabeledField id={idLabelId} label="身分證字號">
                <CustomInput
                  id={idLabelId}
                  type="text"
                  placeholder="A012345678"
                  value={idNumber}
                  maxLength={10}
                  onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
                  error={errors.idNumber}
                  errorMessage={errors.idNumber}
                />
              </LabeledField>

              {/* address */}
              <LabeledField id={addressLabelId} label="戶籍地址">
                <CustomInput
                  id={addressLabelId}
                  type="text"
                  placeholder="請輸入完整地址"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  error={errors.address}
                  errorMessage={errors.address}
                />
              </LabeledField>
            </CardContent>
            <CardFooter className="p-0">
              <Button type="submit" size="lg" className="w-full">
                送出
              </Button>
            </CardFooter>
          </Card>
        </form>

        {/*  Warning Notice */}
        <article className="mx-auto space-y-2 text-text-secondary md:max-w-180 xl:max-w-200">
          <InfoSection title="法律責任與平台免責聲明">
            <ul className={ulStyle}>
              <li>
                客戶應對其提供之廣告內容負全部法律責任，包括但不限於著作權、肖像權、個資保護、商標權等。
              </li>
              <li>
                本公司僅提供廣告託播平台，對廣告內容之真實性、正確性、合法性及適切性概不負責。
              </li>
              <li>
                若因廣告內容引發任何法律爭議、第三方索賠或主管機關裁罰，客戶應自行承擔所有責任與費用，並賠償本公司因此所受之一切損害，包括但不限於律師費、訴訟費、行政罰鍰等。
              </li>
              <li>本公司保留隨時暫停或拒絕播出之權利，並不負任何賠償責任。</li>
            </ul>
          </InfoSection>
          <InfoSection title="個人資料保護政策">
            <ul className={ulStyle}>
              <li>
                客戶所提供之個人資料（姓名、聯絡方式、身分證明等），本公司將依《個人資料保護法》規定處理。
              </li>
              <li>
                除非依法或取得客戶書面同意，本公司不會將個人資料提供予第三方。
              </li>
              <li>客戶可隨時申請閱覽、更正、刪除其個人資料。</li>
              <li>
                本條款自客戶提出廣告申請並完成訂單成立時即生效，平台保留隨時修改條款之權利，修改後將公布於活動網頁，不另行通知。
              </li>
            </ul>
          </InfoSection>
          <InfoSection title="條款生效與同意聲明">
            <p>
              本服務條款自客戶提出廣告申請即生效，客戶提出申請即視為已充分閱讀、理解並同意遵守本託播須知、素材製作規範、法律責任條款及個人資料保護政策之所有內容。
            </p>
          </InfoSection>
          <p>
            本公司保留隨時修改本服務須知條款之權利，修改後之條款將公布於活動網頁，不另行通知。
          </p>
        </article>
      </PageMain>
    </>
  )
}

function InfoSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="text-text-secondary">
      <h6 className="text-brand-primary">{title}</h6>
      {children}
    </section>
  )
}

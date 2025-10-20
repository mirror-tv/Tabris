import arrowSvg from '@/assets/icons/arrow.svg'
import mailSvg from '@/assets/icons/mail.svg'
import phoneSvg from '@/assets/icons/phone.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type MailOrPhoneFormProps = {
  status: 'email' | 'phone' | 'OPT'
  email: string
  phone: string
  setEmail: (email: string) => void
  setPhone: (phone: string) => void
  setStatus: React.Dispatch<React.SetStateAction<'email' | 'phone' | 'OPT'>>
  handleSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  error: string
}

export default function MailOrPhoneForm({
  status,
  email,
  phone,
  setEmail,
  setPhone,
  setStatus,
  handleSubmit,
  isLoading,
  error,
}: MailOrPhoneFormProps) {
  return (
    <>
      <h3 className="text-center text-text-primary">鏡新聞個人廣告系統</h3>
      <p className="text-center text-text-secondary">
        請輸入您註冊應援科技使用的電子信箱／手機號碼
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex w-full flex-col gap-4">
        {status === 'email' && (
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="font-sans text-sm leading-normal font-medium text-text-primary"
            >
              電子信箱
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sample@gmail.com"
              className="h-[45px] rounded-lg"
              error={error.includes('電子信箱') ? 'error' : undefined}
              errorMessage={error.includes('電子信箱') ? error : ''}
              icon={
                <img
                  src={mailSvg as unknown as string}
                  alt="mail"
                  width="16"
                  height="16"
                />
              }
            />
          </div>
        )}

        {status === 'phone' && (
          <div className="flex flex-col gap-1">
            <label
              htmlFor="phone"
              className="font-sans text-sm leading-normal font-medium text-text-primary"
            >
              手機號碼
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="範例：0922119187"
              className="rounded-lg"
              error={error.includes('手機號碼') ? 'error' : undefined}
              errorMessage={error.includes('手機號碼') ? error : ''}
              icon={
                <img
                  src={phoneSvg as unknown as string}
                  alt="phone"
                  width="16"
                  height="16"
                />
              }
            />
          </div>
        )}

        <p
          onClick={() =>
            setStatus((prev) => (prev === 'email' ? 'phone' : 'email'))
          }
          className="flex cursor-pointer items-center text-sm leading-normal font-medium text-brand-primary hover:cursor-pointer"
        >
          使用{status === 'email' ? '手機號碼' : '電子信箱'}登入
          <img
            src={arrowSvg as unknown as string}
            alt="arrow"
            width="16"
            height="17"
            className="inline"
          />
        </p>

        <Button type="submit" disabled={isLoading} size="lg" className="w-full">
          {isLoading ? '發送中...' : '發送驗證碼'}
        </Button>
      </form>
    </>
  )
}

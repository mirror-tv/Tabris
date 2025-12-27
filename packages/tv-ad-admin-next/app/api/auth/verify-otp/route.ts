/**
 * POST /api/auth/verify-otp
 * 驗證 OTP 並生成 Firebase Custom Token
 */

import { NextRequest, NextResponse } from 'next/server'

import {
  createCustomToken,
  getOrCreateFirebaseUser,
} from '@/utils/firebase-admin'
import { createErrorLogger } from '@/utils/error-handler'
import { getMemberByEmail } from '@/utils/member'
import { verifyOTP } from '@/utils/otp-storage'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!otp) {
      return NextResponse.json(
        { success: false, message: '請輸入驗證碼' },
        { status: 400 }
      )
    }

    if (!email) {
      return NextResponse.json(
        { success: false, message: '請提供電子信箱' },
        { status: 400 }
      )
    }

    // 驗證 OTP
    const result = await verifyOTP(email, otp)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      )
    }

    // 取得 member id（登入時就取得，之後可以直接用 id 查詢）
    const member = await getMemberByEmail(email)

    if (!member?.id) {
      return NextResponse.json(
        { success: false, message: '無法取得會員資料，請重新登入' },
        { status: 404 }
      )
    }

    const hasIdentified = !!member.nationalId && !!member.residentialAddress

    // 取得或創建 Firebase User
    // 優先使用 member 的 firebaseID，如果沒有則創建新的
    let firebaseUid: string
    try {
      if (member.firebaseID) {
        firebaseUid = member.firebaseID
      } else {
        // 創建新的 Firebase User
        firebaseUid = await getOrCreateFirebaseUser(email)
        // TODO: 更新 CMS member 的 firebaseID 欄位
        // await updateMemberFirebaseId(member.id, firebaseUid)
      }

      // 生成 Firebase Custom Token
      // 在 customClaims 中加入 memberId 和 hasIdentified，方便後續使用
      const customToken = await createCustomToken(firebaseUid, {
        memberId: member.id,
        email,
        hasIdentified,
      })

      const userPayload = {
        userId: firebaseUid,
        memberId: member.id,
        email,
        hasIdentified,
      }

      // 返回 Custom Token 給前端
      // 前端需要使用 Firebase SDK 交換 ID Token
      return NextResponse.json({
        success: true,
        message: '登入成功',
        data: {
          customToken, // 前端需要使用這個 token 交換 ID Token
        },
        user: userPayload,
      })
    } catch (firebaseError: any) {
      // Firebase 相關錯誤處理
      if (
        firebaseError?.message?.includes('Firebase Admin SDK 環境變數未設定')
      ) {
        createErrorLogger('Firebase 環境變數未設定')(firebaseError)
        return NextResponse.json(
          {
            success: false,
            message:
              'Firebase 環境變數未設定。請設定 FIREBASE_ADMIN_PRIVATE_KEY, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PROJECT_ID',
          },
          { status: 500 }
        )
      }
      throw firebaseError // 重新拋出其他錯誤
    }
  } catch (error) {
    createErrorLogger('驗證 OTP 錯誤')(error)
    return NextResponse.json(
      { success: false, message: '伺服器錯誤' },
      { status: 500 }
    )
  }
}

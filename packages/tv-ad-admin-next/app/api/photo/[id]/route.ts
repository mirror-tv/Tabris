import { NextResponse } from 'next/server'

import {
  getPhotoForUploadPreviewQuery,
  PhotoRecordForUploadPreview,
} from '@/graphql/queries/photo'
import { getClient } from '@/utils/apollo-client'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = getClient()
    const { data } = await client.query<{
      photo: PhotoRecordForUploadPreview | null
    }>({
      query: getPhotoForUploadPreviewQuery,
      variables: { where: { id: params.id } },
    })

    if (!data?.photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    return NextResponse.json(data.photo)
  } catch (error) {
    console.error('[Photo API] Failed to fetch photo:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

/**
 * PhotoSchema
 * Represents the Keystone Photo list, including generated URL and metadata.
 */
export type PhotoSchema = {
  id: string
  name: string
  imageFile_id?: string | null
  imageFile_extension?: string | null
  url?: string | null //  Virtual field: the complete public image URL generated from GCS path.
  urlOriginal?: string | null // Legacy field kept for backward compatibility with older image uploads.
  createdAt?: string
  updatedAt?: string
}

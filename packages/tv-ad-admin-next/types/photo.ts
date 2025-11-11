export type PhotoSchema = {
  id: string
  name: string
  url: string | null
  urlOriginal?: string | null
  imageFile?: {
    id: string
    url: string
    width: number
    height: number
    filesize: number
    extension: string
  } | null
  createdAt?: string
  updatedAt?: string
}

export type ImageSource = string | ArrayBuffer | null

export interface Uploader {
  alt?: string | null
  image?: ImageSource
  url?: string
  raw?: File
}

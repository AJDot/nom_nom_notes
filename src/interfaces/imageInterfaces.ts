export type ImageSource = string | ArrayBuffer | null

export interface Uploader {
  image?: ImageSource
  url?: string
  raw?: File
}

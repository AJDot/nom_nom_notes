export interface FileUpload {
  clientId: string
  attachableId: string
  attachableType: string
  file: { url: string }
}
import { Attribute } from "@vuex-orm/core"
import { FileUpload as IFileUpload } from './../interfaces/fileUploadInterfaces'
import AModel, { AModelAttributes, AModelFields } from "./aModel"

export type FileUploadAttributes = AModelAttributes & IFileUpload

export interface RFileUpload extends FileUploadAttributes {
}

type FileUploadFields = AModelFields & {
  [key in keyof FileUploadAttributes]: Attribute
}

export default class FileUpload extends AModel implements RFileUpload {
  static entity = 'fileUploads'

  static fields(): FileUploadFields {
    return {
      ...super.fields(),
      attachableId: this.string(null),
      attachableType: this.string(null),
      file: this.attr(() => {})
    }
  }

  attachableId!: string
  attachableType!: string
  file!: { url: string }
}

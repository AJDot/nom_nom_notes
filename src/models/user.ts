import { Attribute } from '@vuex-orm/core'
import AModel, { AModelAttributes, AModelFields } from 'Models/aModel'

export type UserAttributes = AModelAttributes & {
  email: string
  username: string
}

export interface RUser extends UserAttributes {
}

type UserFields = AModelFields & {
  [key in keyof UserAttributes]: Attribute
}

export default class User extends AModel implements RUser {
  static entity = 'users'

  static fields(): UserFields {
    return {
      ...super.fields(),
      email: this.string(''),
      username: this.string(''),
    }
  }

  email!: string
  username!: string
}

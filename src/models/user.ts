import AModel, { AModelAttributes } from 'Models/aModel'
import { Attribute } from '@vuex-orm/core'

export type UserAttributes = {
  email: string
  username: string
}

export interface RUser extends AModelAttributes, UserAttributes {
}

type UserFields = {
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

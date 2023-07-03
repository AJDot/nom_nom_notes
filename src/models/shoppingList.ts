import { Attribute } from '@vuex-orm/core'
import { HasOne } from 'Interfaces/modelInterfaces'
import AModel, { AModelAttributes, AModelFields } from 'Models/aModel'
import User from 'Models/user'
import { ShoppingListItem } from 'Interfaces/shoppingListInterfaces'

export type ShoppingListAttributes = AModelAttributes & {
  items: Array<ShoppingListItem>
} &
HasOne<'owner', User>

export interface RShoppingList extends ShoppingListAttributes {
}

type ShoppingListFields = AModelFields & {
  [key in keyof ShoppingListAttributes]: Attribute
}

export default class ShoppingList extends AModel implements RShoppingList {
  static entity = 'ShoppingList'
  static modelName = 'ShoppingList'

  static fields(): ShoppingListFields {
    return {
      ...super.fields(),
      items: this.attr(() => []),
      ownerId: this.string(''),
      owner: this.belongsTo(User, 'ownerId', 'clientId'),
    }
  }

  items!: ShoppingListItem[]
  ownerId!: string
  owner!: User

  $toJson(): Record<string, unknown> {
    const json = super.$toJson()
    delete json.owner
    return json
  }
}

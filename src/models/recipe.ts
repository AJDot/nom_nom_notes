import Model from '~/models/model'
import { Nameable } from 'Interfaces/model_interfaces'

export interface RRecipe extends Nameable {
}

export default class Recipe extends Model implements RRecipe {
  name: string | undefined
}

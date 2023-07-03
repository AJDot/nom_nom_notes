import VuexORM from '@vuex-orm/core'
import DynamicRecipe from 'Models/dynamicRecipe'
import Feature from 'Models/feature'
import FileUpload from 'Models/fileUpload'
import Ingredient from 'Models/ingredient'
import Recipe from 'Models/recipe'
import ShoppingList from 'Models/shoppingList'
import Step from 'Models/step'
import Tag from 'Models/tag'
import Tagging from 'Models/tagging'
import User from 'Models/user'

const database = new VuexORM.Database()
database.register(Feature)
database.register(User)
database.register(Recipe)
database.register(Step)
database.register(Ingredient)
database.register(Tag)
database.register(Tagging)
database.register(DynamicRecipe)
database.register(FileUpload)
database.register(ShoppingList)

export default database

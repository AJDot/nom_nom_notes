import VuexORM from '@vuex-orm/core'
import Feature from 'Models/feature'
import Ingredient from 'Models/ingredient'
import Recipe from 'Models/recipe'
import Step from 'Models/step'
import Tagging from 'Models/tagging'
import User from 'Models/user'
import DynamicRecipe from '~/models/dynamicRecipe'
import FileUpload from '~/models/fileUpload'
import Tag from '~/models/tag'

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

export default database

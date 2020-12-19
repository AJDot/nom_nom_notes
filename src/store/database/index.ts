import VuexORM from '@vuex-orm/core'
import Recipe from 'Models/recipe'
import Step from 'Models/step'
import Ingredient from 'Models/ingredient'

const database = new VuexORM.Database()
database.register(Recipe)
database.register(Step)
database.register(Ingredient)

export default database

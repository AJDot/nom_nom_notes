import VuexORM from '@vuex-orm/core'
import Recipe from 'Models/recipe'
import Step from 'Models/step'

const database = new VuexORM.Database()
database.register(Recipe)
database.register(Step)

export default database

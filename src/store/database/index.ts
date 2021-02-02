import VuexORM from '@vuex-orm/core'
import Feature from 'Models/feature'
import User from 'Models/user'
import Recipe from 'Models/recipe'
import Step from 'Models/step'
import Ingredient from 'Models/ingredient'
import Category from 'Models/category'
import RecipeCategory from 'Models/recipeCategory'

const database = new VuexORM.Database()
database.register(Feature)
database.register(User)
database.register(Recipe)
database.register(Step)
database.register(Ingredient)
database.register(Category)
database.register(RecipeCategory)

export default database

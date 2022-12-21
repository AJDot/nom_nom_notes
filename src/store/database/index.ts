import VuexORM from '@vuex-orm/core'
import Category from 'Models/category'
import Feature from 'Models/feature'
import Ingredient from 'Models/ingredient'
import Recipe from 'Models/recipe'
import RecipeCategory from 'Models/recipeCategory'
import Step from 'Models/step'
import User from 'Models/user'
import DynamicRecipe from '~/models/dynamicRecipe'

const database = new VuexORM.Database()
database.register(Feature)
database.register(User)
database.register(Recipe)
database.register(Step)
database.register(Ingredient)
database.register(Category)
database.register(RecipeCategory)
database.register(DynamicRecipe)

export default database

import { Getter, GetterTree } from 'vuex'
import { RecipesState, RootState } from '~/store/interfaces'

export enum RecipeGetterTypes {}

type RecipeGetters = {
  [key in RecipeGetterTypes]: Getter<RecipesState, RootState>;
}

const getters: GetterTree<RecipesState, RootState> & RecipeGetters = {}

export default getters

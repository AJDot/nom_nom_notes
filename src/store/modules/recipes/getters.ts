import { Getter, GetterTree } from 'vuex'
import { RecipesState, RootState } from '~/store/interfaces'

export enum RecipeGetterTypes {
  FIND = 'FIND',
}

type RecipeGetters = {[key in RecipeGetterTypes]: Getter<RecipesState, RootState>}

const getters: GetterTree<RecipesState, RootState> & RecipeGetters = {
  [RecipeGetterTypes.FIND]: state => (id: string | number) => state.all.find(c => c.id && c.id.toString() === id.toString()),
}

export default getters

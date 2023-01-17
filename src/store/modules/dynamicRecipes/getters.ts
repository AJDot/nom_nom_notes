import { Getter, GetterTree } from 'vuex'
import { DynamicRecipesState, RootState } from '~/store/interfaces'

export enum DynamicRecipeGetterTypes {}

type DynamicRecipeGetters = {
  [key in DynamicRecipeGetterTypes]: Getter<DynamicRecipesState, RootState>;
}

const getters: GetterTree<DynamicRecipesState, RootState> & DynamicRecipeGetters = {}

export default getters

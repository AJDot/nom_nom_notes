import { Getter, GetterTree } from 'vuex'
import { CategoriesState, RootState } from '~/store/interfaces'

export enum CategoryGetterTypes {}

type CategoryGetters = {
  [key in CategoryGetterTypes]: Getter<CategoriesState, RootState>;
}

const getters: GetterTree<CategoriesState, RootState> & CategoryGetters = {}

export default getters

import { GetterTree } from 'vuex'
import { RecipesState, RootState } from '~/store/interfaces'

const getters: GetterTree<RecipesState, RootState> = {
  find: state => (id: string | number) => state.all.find(c => c.id && c.id.toString() === id.toString()),
}

export default getters

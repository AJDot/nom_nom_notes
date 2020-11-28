import { GetterTree } from 'vuex'
import { PersistenceState, RootState } from '~/store/interfaces'
import Recipe from 'Models/recipe'

const getters: GetterTree<PersistenceState<Recipe>, RootState> = {
  find: state => (id: string | number) => state.all.find(c => c.id && c.id.toString() === id.toString()),
}

export default getters

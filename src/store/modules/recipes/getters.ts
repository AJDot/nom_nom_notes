import { GetterTree } from 'vuex'
import { PersistenceState, RootState } from '~/store/interfaces'
import Recipe from 'Models/recipe'

const getters: GetterTree<PersistenceState<Recipe>, RootState> = {
  find: state => (id: string) => state.all.find(c => c.id === id),
}

export default getters

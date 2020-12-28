import { Mutation, MutationTree } from 'vuex'
import Category from 'Models/category'
import { ArrayUtils } from '~/utils/arrayUtils'
import { CategoriesState } from '~/store/interfaces'
import { RRecord } from 'Interfaces/modelInterfaces'

export enum CategoryMutationTypes {
  SET = 'SET',
}

type CategoryMutations = { [key in CategoryMutationTypes]: Mutation<CategoriesState> }

const mutations: MutationTree<CategoriesState> & CategoryMutations = {
  async [CategoryMutationTypes.SET](state, categories: RRecord[]) {
    categories = ArrayUtils.wrap(categories)
    // delete all categories that don't match the incoming ids
    Category.query()
      .where((category: Category) => {
        return !categories.some((r) => r.clientId === category.clientId)
      })
      .get()
      .forEach((category) => category.$delete())
    await Category.insertOrUpdate({ data: categories })
  },
}

export default mutations

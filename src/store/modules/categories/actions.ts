import { Action, ActionContext, ActionTree } from 'vuex'
import { CategoriesState, RootState } from '~/store/interfaces'
import Category, { CategoryAttributes } from 'Models/category'
import { ApiPath } from '~/router/path'
import { ServerData, ServerResponse } from 'Interfaces/serverInterfaces'
import { CategoryMutationTypes } from '~/store/modules/categories/mutations'
import { securedAxiosInstance } from '~/backend/axios'
import { AxiosResponse } from 'axios'
import { StoreUtils } from '~/utils/storeUtils'

export enum CategoryActionTypes {
  FETCH_ALL = 'FETCH_ALL',
  CREATE = 'CREATE',
}

type CategoryActions = {
  [key in CategoryActionTypes]: Action<CategoriesState, RootState>;
}

const actions: ActionTree<CategoriesState, RootState> & CategoryActions = {
  async [CategoryActionTypes.FETCH_ALL]({ commit }: ActionContext<CategoriesState, RootState>) {
    const response: AxiosResponse<ServerResponse<CategoryAttributes, Array<ServerData>>> = await securedAxiosInstance.get(ApiPath.base() + ApiPath.categories())
    commit(
      CategoryMutationTypes.SET,
      response.data.data.map((x) => {
        return { id: x.id, ...x.attributes }
      }),
    )
    await StoreUtils.processIncluded(Category, response.data.included)
    return response
  },
  async [CategoryActionTypes.CREATE](_store: ActionContext<CategoriesState, RootState>, category: Category): Promise<AxiosResponse<ServerResponse<CategoryAttributes>>> {
    const response: AxiosResponse<ServerResponse<CategoryAttributes>> = await securedAxiosInstance.post(ApiPath.base() + ApiPath.categories(), {
      category: category.$toJson(),
    })
    category.id = response.data.data.id
    await category.$update({ data: { id: category.id, ...response.data.data.attributes } })
    return response
  },
}

export default actions

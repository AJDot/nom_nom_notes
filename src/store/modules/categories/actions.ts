import { Action, ActionContext, ActionTree } from 'vuex'
import { CategoriesState, RootState } from '~/store/interfaces'
import Category, { CategoryAttributes } from 'Models/category'
import RoutePath from '~/router/path'
import { ServerData, ServerResponse } from 'Interfaces/serverInterfaces'
import { CategoryMutationTypes } from '~/store/modules/categories/mutations'
import { securedAxiosInstance } from '~/backend/axios'
import { AxiosResponse } from 'axios'
import { StoreUtils } from '~/utils/storeUtils'

export enum CategoryActionTypes {
  FETCH_ALL = 'FETCH_ALL',
}

type CategoryActions = {
  [key in CategoryActionTypes]: Action<CategoriesState, RootState>;
}

const actions: ActionTree<CategoriesState, RootState> & CategoryActions = {
  async [CategoryActionTypes.FETCH_ALL]({ commit }: ActionContext<CategoriesState, RootState>) {
    const response: AxiosResponse<ServerResponse<CategoryAttributes, Array<ServerData>>> = await securedAxiosInstance.get(RoutePath.apiBase() + RoutePath.categories())
    commit(
      CategoryMutationTypes.SET,
      response.data.data.map((x) => {
        return { id: x.id, ...x.attributes }
      }),
    )
    await StoreUtils.processIncluded(Category, response.data.included)
    return response
  },
}

export default actions

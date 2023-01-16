import { AxiosResponse } from 'axios'
import { ServerRecordData, ServerRecordResponse } from 'Interfaces/serverInterfaces'
import { Action, ActionContext, ActionTree } from 'vuex'
import { securedAxiosInstance } from '~/backend/axios'
import Tag, { TagAttributes } from '~/models/tag'
import { ApiPath } from '~/router/path'
import { RootState, TagsState } from '~/store/interfaces'
import { TagMutationTypes } from '~/store/modules/tags/mutations'
import { StoreUtils } from '~/utils/storeUtils'

export enum TagActionTypes {
  FETCH_ALL = 'FETCH_ALL',
  CREATE = 'CREATE',
}

type TagActions = {
  [key in TagActionTypes]: Action<TagsState, RootState>
}

const actions: ActionTree<TagsState, RootState> & TagActions = {
  async [TagActionTypes.FETCH_ALL]({ commit }: ActionContext<TagsState, RootState>) {
    const response: AxiosResponse<ServerRecordResponse<TagAttributes, Array<ServerRecordData>>> = await securedAxiosInstance.get(ApiPath.base() + ApiPath.tags())
    commit(
      TagMutationTypes.SET,
      response.data.data.map((x) => {
        return { id: x.id, ...x.attributes }
      }),
    )
    await StoreUtils.processIncluded(Tag, response.data.included)
    return response
  },
  async [TagActionTypes.CREATE](_store: ActionContext<TagsState, RootState>, tag: Tag): Promise<AxiosResponse<ServerRecordResponse<TagAttributes>>> {
    const response: AxiosResponse<ServerRecordResponse<TagAttributes>> = await securedAxiosInstance.post(ApiPath.base() + ApiPath.tags(), {
      tag: tag.$toJson(),
    })
    tag.id = response.data.data.id
    await tag.$update({ data: { id: tag.id, ...response.data.data.attributes } })
    return response
  },
}

export default actions

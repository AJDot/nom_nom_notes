import { ServerRecordData, ServerRecordResponse } from 'Interfaces/serverInterfaces'
import { Action, ActionContext, ActionTree } from 'vuex'
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
    const response = await fetch(ApiPath.base() + ApiPath.tags(), {
      headers: { "Content-Type": "application/json" },
    })
    const responseClone = response.clone()
    const json: ServerRecordResponse<TagAttributes, Array<ServerRecordData<TagAttributes>>> = await response.json()
    commit(
      TagMutationTypes.SET,
      json.data.map((x) => {
        return { id: x.id, ...x.attributes }
      }),
    )
    await Promise.all(json.data.map(datum => {
      return StoreUtils.processIncluded(Tag.find(datum.attributes.clientId!)!, json.included)
    }))
    return responseClone
  },
  async [TagActionTypes.CREATE](_store: ActionContext<TagsState, RootState>, tag: Tag): Promise<Response> {
    const response = await fetch(ApiPath.base() + ApiPath.tags(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ tag: tag.$toJson(), }),
    })
    if (!response.ok) return response

    const responseClone = response.clone()
    const json: ServerRecordResponse<TagAttributes> = await response.json()
    tag.id = json.data.id
    await tag.$insertOrUpdate({ data: { id: tag.id, ...json.data.attributes } })
    return responseClone
  },
}

export default actions

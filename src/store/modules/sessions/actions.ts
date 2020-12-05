import { Action, ActionContext, ActionTree } from 'vuex'
import { RootState, SessionsState } from '~/store/interfaces'
import AjaxRequest from '~/services/ajaxRequest'
import Path from '~/router/path'
import { Response } from 'Interfaces/server_interfaces'

interface SessionResponse extends Response {
}

interface SessionsResponse extends Response {
}

export enum SessionActionTypes {
  CREATE = 'CREATE',
}

type SessionActions = {[key in SessionActionTypes]: Action<SessionsState, RootState>}

const actions: ActionTree<SessionsState, RootState> & SessionActions = {
  async [SessionActionTypes.CREATE]({ commit }: ActionContext<SessionsState, RootState>, id: string) {
    // const [result, statusText, xhr] = await new AjaxRequest({
    //   url: Path.apiBase() + Path.recipe(id),
    //   type: 'GET',
    //   dataType: 'json',
    // }).send<SessionResponse>()
    // // commit('add', new Recipe(result.recipe))
    // return [result, statusText, xhr]
  },
}

export default actions

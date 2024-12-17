import { Getter, GetterTree } from 'vuex'
import { SessionsState, RootState } from '~/store/interfaces'

export enum SessionGetterTypes {
  SIGNED_IN = 'SIGNED_IN',
}

type SessionGetters = {
  [key in SessionGetterTypes]: Getter<SessionsState, RootState>;
}

const getters: GetterTree<SessionsState, RootState> & SessionGetters = {
  [SessionGetterTypes.SIGNED_IN]: (state, getters, rootState) => {
    return Boolean(rootState.users.current)
  },
}

export default getters

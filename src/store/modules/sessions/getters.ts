import { Getter, GetterTree } from 'vuex'
import { SessionsState, RootState } from '~/store/interfaces'

export enum SessionGetterTypes {
  CSRF = 'CSRF',
  SIGNED_IN = 'SIGNED_IN',
}

type SessionGetters = { [key in SessionGetterTypes]: Getter<SessionsState, RootState> }

const getters: GetterTree<SessionsState, RootState> & SessionGetters = {
  [SessionGetterTypes.CSRF]: state => state.csrf,
  [SessionGetterTypes.SIGNED_IN]: state => state.signedIn,
}

export default getters

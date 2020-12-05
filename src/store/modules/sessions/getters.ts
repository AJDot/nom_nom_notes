import { Getter, GetterTree } from 'vuex'
import { SessionsState, RootState } from '~/store/interfaces'

export enum SessionGetterTypes {
}

type SessionGetters = {[key in SessionGetterTypes]: Getter<SessionsState, RootState>}

const getters: GetterTree<SessionsState, RootState> & SessionGetters = {
}

export default getters

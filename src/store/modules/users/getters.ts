import { Getter, GetterTree } from 'vuex'
import { UsersState, RootState } from '~/store/interfaces'

export enum UserGetterTypes {}

type UserGetters = {
  [key in UserGetterTypes]: Getter<UsersState, RootState>;
}

const getters: GetterTree<UsersState, RootState> & UserGetters = {}

export default getters

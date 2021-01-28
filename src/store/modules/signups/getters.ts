import { Getter, GetterTree } from 'vuex'
import { SignupsState, RootState } from '~/store/interfaces'

export enum SignupGetterTypes {
}

type SignupGetters = {
  [key in SignupGetterTypes]: Getter<SignupsState, RootState>;
}

const getters: GetterTree<SignupsState, RootState> & SignupGetters = {
}

export default getters

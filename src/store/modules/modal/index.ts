import {
  Action,
  ActionTree,
  Commit,
  Getter,
  GetterTree,
  Module,
  Mutation,
  MutationTree,
} from 'vuex'
import { RootState } from '~/store/interfaces'
import { ModalId } from '~/enums/modalId'
import { ArrayUtils } from '~/utils/arrayUtils'

export interface ModalState {
  modals: Array<ModalId>
}

export enum ModalGetterTypes {}

export enum ModalMutationTypes {
  TOGGLE = 'TOGGLE',
}

export enum ModalActionTypes {
  TOGGLE = 'TOGGLE',
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

type ModalGetters = {
  [key in ModalGetterTypes]: Getter<ModalState, RootState>
}
type ModalMutations = { [key in ModalMutationTypes]: Mutation<ModalState> }
type ModalActions = {
  [key in ModalActionTypes]: Action<ModalState, RootState>
}

const state: () => ModalState = () => ({
  modals: [],
})

const getters: GetterTree<ModalState, RootState> & ModalGetters = {}

const mutations: MutationTree<ModalState> & ModalMutations = {
  [ModalMutationTypes.TOGGLE](storeState, {
    id,
    state,
  }: { id: ModalId, state?: boolean }) {
    if (state === true) {
      ArrayUtils.add(storeState.modals, id)
    } else if (state === false) {
      ArrayUtils.remove(storeState.modals, id)
    } else {
      ArrayUtils.toggle(storeState.modals, id)
    }
  },
}

const actions: ActionTree<ModalState, RootState> & ModalActions = {
  [ModalActionTypes.ADD]({ commit }: { commit: Commit }, { id }: { id: ModalId }) {
    commit(ModalMutationTypes.TOGGLE, { id, state: true, })
  },
  [ModalActionTypes.REMOVE]({ commit }: { commit: Commit }, { id }: { id: ModalId }) {
    commit(ModalMutationTypes.TOGGLE, { id, state: false, })
  },
  [ModalActionTypes.TOGGLE]({ commit }: { commit: Commit }, { id, state, }: { id: ModalId, state?: boolean }) {
    commit(ModalMutationTypes.TOGGLE, { id, state, })
  },
}

const modal: Module<ModalState, RootState> = {
  namespaced: true as const,
  state,
  getters,
  mutations,
  actions,
}

export default modal

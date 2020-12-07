import { Mutation, MutationTree } from 'vuex'
import { SessionsState } from '~/store/interfaces'

export enum SessionMutationTypes {
  SET_CSRF = 'SET_CSRF',
  SET_SIGNED_IN = 'SET_SIGNED_IN',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
}

type SessionMutations = {
  [key in SessionMutationTypes]: Mutation<SessionsState>;
}

function setCsrf(state: SessionsState, csrf: string | null): void {
  state.csrf = csrf
  if (csrf) {
    localStorage.csrf = state.csrf
  } else {
    delete localStorage.csrf
  }
}

function setSignedIn(state: SessionsState, signedIn: boolean | null): void {
  state.signedIn = signedIn
  if (signedIn) {
    localStorage.signedIn = state.signedIn
  } else {
    delete localStorage.signedIn
  }
}

const mutations: MutationTree<SessionsState> & SessionMutations = {
  [SessionMutationTypes.SIGN_IN](state: SessionsState, csrf: string): void {
    setCsrf(state, csrf)
    setSignedIn(state, true)
  },
  [SessionMutationTypes.SIGN_OUT](state: SessionsState): void {
    setCsrf(state, null)
    setSignedIn(state, null)
  },
  [SessionMutationTypes.SET_CSRF]: setCsrf,
  [SessionMutationTypes.SET_SIGNED_IN]: setSignedIn,
}

export default mutations

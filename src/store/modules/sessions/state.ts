import { SessionsState } from '~/store/interfaces'

const state: () => SessionsState = () => ({
  csrf: localStorage.csrf,
  signedIn: localStorage.signedIn === 'true',
})

export default state

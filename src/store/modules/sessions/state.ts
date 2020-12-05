import { SessionsState } from '~/store/interfaces'

const state: (() => SessionsState) = () => ({
  all: [],
})

export default state

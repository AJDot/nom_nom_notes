import { RecipesState } from '~/store/interfaces'

const state: (() => RecipesState) = () => ({
  all: [],
})

export default state

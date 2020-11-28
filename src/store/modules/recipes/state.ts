import { PersistenceState } from '~/store/interfaces'
import Recipe from 'Models/recipe'

const state: (() => PersistenceState<Recipe>) = () => ({
  all: [],
})

export default state

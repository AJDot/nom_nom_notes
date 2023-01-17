import { AppAbility } from '~/appAbility'
import { AbilityState } from '~/store/interfaces'

const state: () => AbilityState = () => ({
  ability: new AppAbility(),
})

export default state

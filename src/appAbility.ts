import { Ability, AbilityClass, AbilityTuple, MongoQuery, RawRuleFrom, Subject } from '@casl/ability'
import { AnyObject } from '@casl/ability/dist/types/types'

type Actions = 'create' | 'read' | 'update' | 'delete'
type Subjects = 'Recipe' | 'DynamicRecipe'

export type AppAbilityTuple = AbilityTuple<Actions, Subjects | Subject>

export type AppAbility = Ability<AppAbilityTuple>
export type AbilityRules = RawRuleFrom<AppAbilityTuple, MongoQuery<AnyObject>>[]
export const AppAbility = Ability as AbilityClass<AppAbility>

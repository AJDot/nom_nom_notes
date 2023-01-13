import { RecipeActionTypes } from './../store/modules/recipes/actions'
import Feature from 'Models/feature'
import ChangePassword from 'Views/passwords/change.vue'
import ForgotPassword from 'Views/passwords/forgot.vue'
import { createRouter, createWebHistory, NavigationGuard, RouteLocationNormalized, RouteRecord, RouteRecordRaw } from 'vue-router'
import { AppAbilityTuple } from '~/appAbility'
import AppConfig from '~/appConfig'
import Recipe from '~/models/recipe'
import { AppPath } from '~/router/path'
import { RouteName } from '~/router/routeName'
import { store, StoreModulePath } from '~/store'
import { StoreModuleType } from '~/store/interfaces'
import { FlashActionTypes } from '~/store/modules/flash'
import EditDynamicRecipe from '~/views/dynamicRecipes/edit.vue'
import EditDynamicRecipeHeader from '~/views/dynamicRecipes/editHeader.vue'
import ListDynamicRecipe from '~/views/dynamicRecipes/list.vue'
import ListDynamicRecipeHeader from '~/views/dynamicRecipes/listHeader.vue'
import ShowDynamicRecipeHeader from '~/views/dynamicRecipes/showHeader.vue'
import NotFound from '~/views/NotFound.vue'
import EditRecipe from '~/views/recipes/edit.vue'
import EditRecipeHeader from '~/views/recipes/editHeader.vue'
import ListRecipe from '~/views/recipes/list.vue'
import ListRecipeHeader from '~/views/recipes/listHeader.vue'
import ShowRecipe from '~/views/recipes/show.vue'
import ShowRecipeHeader from '~/views/recipes/showHeader.vue'
import SignIn from '~/views/signIn.vue'
import SignUp from '~/views/signUp.vue'

const publicRoutes: Array<RouteRecord['name'] | null | undefined> = [
  RouteName.Home,
  RouteName.SignIn,
  RouteName.SignUp,
  RouteName.Recipes,
  RouteName.Recipe,
  RouteName.DynamicRecipes,
  RouteName.DynamicRecipe,
  RouteName.NotFound,
  RouteName.ForgotPassword,
  RouteName.ChangePassword,
]

const checkSignIn: NavigationGuard = (to, _from) => {
  // if a public route, navigate to it
  if (publicRoutes.includes(to.name) || store.state[StoreModuleType.Session].signedIn) {
    return true
  } else {
    // if not a public route, navigate to sign in
    return {
      name: RouteName.SignIn,
      params: { originalRequest: to.path },
    }
  }
}

const checkCanSignUp: NavigationGuard = async (_to, _from) => {
  if (await Feature.isOff('signup')) {
    await store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
      flash: { alert: 'Unable to sign up. Action is forbidden.' },
      hold: true,
    })
    return {
      name: RouteName.Home,
    }
  }
  return true
}

const getRecipe: (route: RouteLocationNormalized) => Promise<Recipe | null> = async (route: RouteLocationNormalized) => {
  let recipe = Recipe.find(route.params.clientId)
  if (!recipe) {
    await store.dispatch(StoreModulePath.Recipes + RecipeActionTypes.FETCH, route.params.clientId)
    recipe = Recipe.query().where({ clientId: route.params.clientId }).first()
  }
  return recipe
}

type OnFail<T> = (record: T | null, to: Parameters<NavigationGuard>[0], from: Parameters<NavigationGuard>[1]) => Promise<ReturnType<NavigationGuard>>

const checkAbilityFactory: <T extends AppAbilityTuple[1]>(action: AppAbilityTuple[0], subject: (route: RouteLocationNormalized) => Promise<T | null>, onFail: OnFail<T>) => NavigationGuard = (action, subject, onFail) => async (to, from) => {
  const record = await subject(to)
  const ability = store.state.ability.ability
  if (record && ability.can(action, record)) {
    return true
  } else {
    return await onFail(record, to, from)
  }
}

const routes: (RouteRecordRaw & { name: RouteName })[] = [
  {
    name: RouteName.Home,
    path: AppPath.home(),
    redirect: { name: RouteName.Recipes },
  },
  {
    name: RouteName.Recipes,
    path: AppPath.recipes(),
    components: {
      default: ListRecipe,
      'secondary-header': ListRecipeHeader,
    },
  },
  {
    name: RouteName.NewRecipe,
    path: AppPath.newRecipe(),
    component: EditRecipe,
    props: { mode: 'create' },
  },
  {
    name: RouteName.Recipe,
    path: AppPath.recipe(':clientId'),
    components: {
      default: ShowRecipe,
      'secondary-header': ShowRecipeHeader,
    },
  },
  {
    name: RouteName.EditRecipe,
    path: AppPath.editRecipe(':clientId'),
    components: {
      default: EditRecipe,
      'secondary-header': EditRecipeHeader,
    },
    beforeEnter: checkAbilityFactory('update', getRecipe, async (_record, to, _from) => {
      await store.dispatch(StoreModulePath.Flash + FlashActionTypes.SET, {
        flash: { alert: 'Unable to edit recipe. Action is forbidden.' },
        hold: true,
      })
      return { name: RouteName.Recipe, params: { clientId: to.params.clientId } }
    })
  },
  {
    name: RouteName.DynamicRecipes,
    path: AppPath.dynamicRecipes(),
    components: {
      default: ListDynamicRecipe,
      'secondary-header': ListDynamicRecipeHeader,
    },
  },
  {
    name: RouteName.NewDynamicRecipe,
    path: AppPath.newDynamicRecipe(),
    components: {
      default: EditDynamicRecipe,
      'secondary-header': EditDynamicRecipeHeader,
    },
    props: {
      default: { view: 'edit' },
    },
  },
  {
    name: RouteName.DynamicRecipe,
    path: AppPath.dynamicRecipe(':clientId'),
    components: {
      default: EditDynamicRecipe,
      'secondary-header': ShowDynamicRecipeHeader,
    },
    props: {
      default: { view: 'show' },
    },
  },
  {
    name: RouteName.EditDynamicRecipe,
    path: AppPath.editDynamicRecipe(':clientId'),
    components: {
      default: EditDynamicRecipe,
      'secondary-header': EditDynamicRecipeHeader,
    },
    props: {
      default: { view: 'edit' },
    },
  },
  {
    name: RouteName.SignIn,
    path: AppPath.signin(),
    component: SignIn,
  },
  {
    name: RouteName.SignUp,
    path: AppPath.signup(),
    component: SignUp,
    beforeEnter: checkCanSignUp,
  },
  {
    name: RouteName.ForgotPassword,
    path: AppPath.forgotPassword(),
    component: ForgotPassword,
  },
  {
    name: RouteName.ChangePassword,
    path: AppPath.changePassword(),
    component: ChangePassword,
  },
  {
    name: RouteName.NotFound,
    path: '/:catchAll(.*)',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(AppConfig.ROOT_PATH),
  routes,
})

router.beforeEach(checkSignIn)

export default router

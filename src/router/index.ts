import { createRouter, createWebHistory, NavigationGuard, RouteRecord, RouteRecordRaw } from 'vue-router'
import ListRecipe from '~/views/recipes/list.vue'
import ListRecipeHeader from '~/views/recipes/listHeader.vue'
import ShowRecipe from '~/views/recipes/show.vue'
import ShowRecipeHeader from '~/views/recipes/showHeader.vue'
import EditRecipe from '~/views/recipes/edit.vue'
import EditRecipeHeader from '~/views/recipes/editHeader.vue'
import SignIn from '~/views/signIn.vue'
import SignUp from '~/views/signUp.vue'
import ForgotPassword from 'Views/passwords/forgot.vue'
import ChangePassword from 'Views/passwords/change.vue'
import NotFound from '~/views/NotFound.vue'
import { RouteName } from '~/router/routeName'
import AppConfig from '~/appConfig'
import { store, StoreModulePath } from '~/store'
import { StoreModuleType } from '~/store/interfaces'
import Feature from 'Models/feature'
import { FlashActionTypes } from '~/store/modules/flash'
import { AppPath } from '~/router/path'

const publicRoutes: Array<RouteRecord['name'] | null | undefined> = [
  RouteName.Home,
  RouteName.SignIn,
  RouteName.SignUp,
  RouteName.Recipes,
  RouteName.Recipe,
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

const routes: RouteRecordRaw[] & { name: RouteName }[] = [
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

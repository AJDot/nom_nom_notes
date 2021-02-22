import { createRouter, createWebHistory, NavigationGuard, RouteRecord, RouteRecordRaw } from 'vue-router'
import ListRecipe from '~/views/recipes/list.vue'
import ListRecipeHeader from '~/views/recipes/listHeader.vue'
import ShowRecipe from '~/views/recipes/show.vue'
import ShowRecipeHeader from '~/views/recipes/showHeader.vue'
import EditRecipe from '~/views/recipes/edit.vue'
import EditRecipeHeader from '~/views/recipes/editHeader.vue'
import SignIn from '~/views/signIn.vue'
import SignUp from '~/views/signUp.vue'
import ForgotPassword from '~/views/forgotPassword.vue'
import NotFound from '~/views/NotFound.vue'
import { RouteName } from '~/router/routeName'
import AppConfig from '~/appConfig'
import { store, StoreModulePath } from '~/store'
import { StoreModuleType } from '~/store/interfaces'
import Feature from 'Models/feature'
import { FlashActionTypes } from '~/store/modules/flash'
import RoutePath from '~/router/path'

const publicRoutes: Array<RouteRecord['name'] | null | undefined> = [
  RouteName.Home,
  RouteName.SignIn,
  RouteName.SignUp,
  RouteName.Recipes,
  RouteName.Recipe,
  RouteName.NotFound,
  RouteName.ForgotPassword,
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
    path: '/',
    redirect: { name: RouteName.Recipes },
  },
  {
    name: RouteName.Recipes,
    path: '/recipes',
    components: {
      default: ListRecipe,
      'secondary-header': ListRecipeHeader,
    },
  },
  {
    name: RouteName.NewRecipe,
    path: '/recipes/new',
    component: EditRecipe,
    props: { mode: 'create' },
  },
  {
    name: RouteName.Recipe,
    path: '/recipes/:clientId',
    components: {
      default: ShowRecipe,
      'secondary-header': ShowRecipeHeader,
    },
  },
  {
    name: RouteName.EditRecipe,
    path: '/recipes/:clientId/edit',
    components: {
      default: EditRecipe,
      'secondary-header': EditRecipeHeader,
    },
  },
  {
    name: RouteName.SignIn,
    path: '/sign_in',
    component: SignIn,
  },
  {
    name: RouteName.SignUp,
    path: '/sign_up',
    component: SignUp,
    beforeEnter: checkCanSignUp,
  },
  {
    name: RouteName.ForgotPassword,
    path: RoutePath.forgotPassword(),
    component: ForgotPassword,
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

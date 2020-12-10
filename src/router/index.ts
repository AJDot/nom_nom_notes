import { createWebHistory, createRouter, RouteRecordRaw, NavigationGuard, RouteRecord } from 'vue-router'
import ListRecipe from '~/views/recipes/list.vue'
import ListRecipeHeader from '~/views/recipes/listHeader.vue'
import NewRecipe from '~/views/recipes/new.vue'
import ShowRecipe from '~/views/recipes/show.vue'
import ShowRecipeHeader from '~/views/recipes/showHeader.vue'
import EditRecipe from '~/views/recipes/edit.vue'
import SignIn from '~/views/signIn.vue'
import SignUp from '~/views/signUp.vue'
import NotFound from '~/views/NotFound.vue'
import { RouteName } from '~/router/routeName'
import AppConfig from '~/appConfig'
import { store } from '~/store'
import { StoreModuleType } from '~/store/interfaces'

const publicRoutes: Array<RouteRecord['name'] | null | undefined> = [
  RouteName.Home,
  RouteName.SignIn,
  RouteName.SignUp,
  RouteName.Recipes,
  RouteName.Recipe,
  RouteName.NotFound,
]

const checkSignIn: NavigationGuard = (to, _from) => {
  // if a public route, navigate to it
  if (publicRoutes.includes(to.name) || store.state[StoreModuleType.Session].signedIn) return true
  else {
    // if not a publish route, navigate to sign in
    return {
      name: RouteName.SignIn,
      params: { originalRequest: to.path },
    }
  }
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
    path: '/recipe',
    component: NewRecipe,
  },
  {
    name: RouteName.Recipe,
    path: '/recipes/:id',
    components: {
      default: ShowRecipe,
      'secondary-header': ShowRecipeHeader,
    },
  },
  {
    name: RouteName.EditRecipe,
    path: '/recipes/:id/edit',
    component: EditRecipe,
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

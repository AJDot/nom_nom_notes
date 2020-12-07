import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router'
import ListRecipe from '~/views/recipes/list.vue'
import ShowRecipe from '~/views/recipes/show.vue'
import ShowRecipeHeader from '~/views/recipes/showHeader.vue'
import EditRecipe from '~/views/recipes/edit.vue'
import SignIn from '~/views/signIn.vue'
import SignUp from '~/views/signUp.vue'
import NotFound from '~/views/NotFound.vue'
import { RouteName } from '~/router/routeName'
import AppConfig from '~/appConfig'

const routes: RouteRecordRaw[] & { name: RouteName }[] = [
  {
    name: RouteName.Home,
    path: '/',
    redirect: { name: RouteName.Recipes },
  },
  {
    name: RouteName.Recipes,
    path: '/recipes',
    component: ListRecipe,
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

export default router

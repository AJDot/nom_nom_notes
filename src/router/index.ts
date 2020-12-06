import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router"
import RecipesIndex from "~/views/recipes/Index.vue"
import ShowRecipe from "~/views/recipes/show.vue"
import SignIn from "~/views/signIn.vue"
import SignUp from "~/views/signUp.vue"
import NotFound from '~/views/NotFound.vue'
import { RouteName } from '~/router/routeName'
import AppConfig from '~/appConfig'

const routes: RouteRecordRaw[] & { name: RouteName }[] = [
  {
    name: RouteName.Home,
    path: "/",
    component: RecipesIndex,
  },
  {
    name: RouteName.Recipe,
    path: "/recipes/:id",
    component: ShowRecipe,
  },
  {
    name: RouteName.Recipes,
    path: "/recipes/:id",
    component: ShowRecipe,
  },
  {
    name: RouteName.SignIn,
    path: "/sign_in",
    component: SignIn,
  },
  {
    name: RouteName.SignUp,
    path: "/sign_up",
    component: SignUp,
  },
  {
    name: RouteName.NotFound,
    path: "/:catchAll(.*)",
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(AppConfig.ROOT_PATH),
  routes,
})

export default router

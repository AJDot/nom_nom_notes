import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router"
import RecipesIndex from "~/views/recipes/Index.vue"
import ShowRecipe from "~/views/recipes/show.vue"
import NewSession from "~/views/sessions/new.vue"
import NotFound from '~/views/NotFound.vue'

const routes: RouteRecordRaw[] = [
  {
    name: "home",
    path: "/",
    component: RecipesIndex,
  },
  {
    name: "recipe",
    path: "/recipes/:id",
    component: ShowRecipe,
  },
  {
    name: "recipe",
    path: "/recipes/:id",
    component: ShowRecipe,
  },
  {
    name: "new-session",
    path: "/sign_in",
    component: NewSession,
  },
  {
    name: 'not-found',
    path: "/:catchAll(.*)",
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

export default router

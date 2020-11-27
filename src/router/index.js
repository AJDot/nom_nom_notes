import { createWebHistory, createRouter } from "vue-router"
import RecipesIndex from "~/views/recipes/Index"
import NotFound from '~/views/NotFound'

const routes = [
  {
    path: "/",
    name: "home",
    component: RecipesIndex,
  },
  {
    name: 'not-found',
    path: "/:catchAll(.*)",
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

export default router

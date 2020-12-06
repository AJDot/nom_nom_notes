import router from "./index"
import { RRecord } from 'Interfaces/model_interfaces'

class Path {
  apiBase(): string {
    return 'http://localhost:3000/api/v1'
  }

  root() {
    return router.options.history.base
  }

  home() {
    return this.root()
  }

  signin(): string {
    return '/signin'
  }

  signup(): string {
    return '/signup'
  }

  refresh(): string {
    return '/refresh'
  }

  recipes() {
    return '/recipes'
  }

  recipe(recipeId: RRecord['id']) {
    return Path.buildPath(`/recipes/:id`, { id: recipeId })
  }

  private static buildPath(path: string, wildcards: object) {
    let result = path
    for (const [key, value] of Object.entries(wildcards)) {
      let val
      if (typeof value === 'string') {
        val = value
      } else {
        val = value.id
      }
      result = result.replace(`:${key}`, val)
    }

    return result
  }
}

const RoutePath = new Path()

export default RoutePath

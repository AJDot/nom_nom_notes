import router from './index'
import { RRecord } from 'Interfaces/model_interfaces'
import { Hash } from 'Interfaces/util_interfaces'

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

  recipe(recipeClientId: RRecord['clientId']) {
    return Path.buildPath('/recipes/:clientId', { clientId: recipeClientId })
  }

  private static buildPath(path: string, wildcards: Hash) {
    let result = path
    for (const [key, value] of Object.entries(wildcards)) {
      let val
      if (typeof value === 'string') {
        val = value
      } else {
        val = value.clientId
      }
      result = result.replace(`:${key}`, val)
    }

    return result
  }
}

const RoutePath = new Path()

export default RoutePath

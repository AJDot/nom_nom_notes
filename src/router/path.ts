import { RRecord } from 'Interfaces/modelInterfaces'
import { Hash } from 'Interfaces/utilInterfaces'
import AppConfig from '~/appConfig'

class Path {
  apiBase(): string {
    return AppConfig.API_URL + '/api/v1'
  }

  base() {
    return window.location.origin
  }

  root() {
    return AppConfig.ROOT_PATH
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

  currentUser() {
    return '/current_user'
  }

  recipes() {
    return '/recipes'
  }

  recipe(recipeClientId: RRecord['clientId']) {
    return Path.buildPath('/recipes/:clientId', { clientId: recipeClientId })
  }

  categories() {
    return '/categories'
  }

  flipperBase() {
    return '/flipper'
  }

  flipperApi() {
    return this.flipperBase() + '/api'
  }

  features() {
    return this.flipperApi() + '/features'
  }

  feature(key: string) {
    return this.features() + `/${key}`
  }

  password() {
    return '/password'
  }

  forgotPassword() {
    return this.password() + '/forgot'
  }

  changePassword() {
    return this.password() + '/change'
  }

  private static buildPath(path: string, wildcards: Hash) {
    let result = path
    for (const [key, value] of Object.entries(wildcards)) {
      let val
      if (typeof value === 'string') {
        val = value
      } else if (typeof value === 'undefined') {
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

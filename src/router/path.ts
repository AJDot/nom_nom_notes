import { RRecord } from 'Interfaces/modelInterfaces'
import AppConfig from '~/appConfig'

class Path {
  protected static buildPath(path: string, wildcards: Record<string, any>) {
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

class AppPath extends Path {
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
    return '/sign_in'
  }

  signup(): string {
    return '/sign_up'
  }

  recipes() {
    return '/recipes'
  }

  newRecipe() {
    return this.recipes() + '/new'
  }

  recipe(recipeClientId: RRecord['clientId']) {
    return Path.buildPath(this.recipes() + '/:clientId', { clientId: recipeClientId })
  }

  editRecipe(recipeClientId: RRecord['clientId']) {
    return this.recipe(recipeClientId) + '/edit'
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
}

class ApiPath extends Path {
  base(): string {
    return AppConfig.API_URL + '/api/v1'
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
    return Path.buildPath(this.recipes() + '/:clientId', { clientId: recipeClientId })
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
}

const appPath = new AppPath()
const apiPath = new ApiPath()

export { appPath as AppPath, apiPath as ApiPath }

import AppConfig from '~/appConfig'

class Path {
  protected static buildPath(path: string, wildcards: Record<string, string | undefined | Record<string, unknown>>) {
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

  recipe(recipeClientId: string) {
    return Path.buildPath(this.recipes() + '/:clientId', { clientId: recipeClientId })
  }

  editRecipe(recipeClientId: string) {
    return this.recipe(recipeClientId) + '/edit'
  }

  dynamicRecipes() {
    return '/dynamic_recipes'
  }

  newDynamicRecipe() {
    return this.dynamicRecipes() + '/new'
  }

  dynamicRecipe(dynamicRecipeClientId: string) {
    return Path.buildPath(this.dynamicRecipes() + '/:clientId', { clientId: dynamicRecipeClientId })
  }

  editDynamicRecipe(dynamicRecipeClientId: string) {
    return this.dynamicRecipe(dynamicRecipeClientId) + '/edit'
  }

  shoppingLists() {
    return '/shopping_lists'
  }

  editShoppingLists() {
    return this.shoppingLists() + '/edit'
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

  refresh(): string {
    return '/refresh'
  }

  currentUser() {
    return '/current_user'
  }

  recipes() {
    return '/recipes'
  }

  recipe(recipeClientId: string) {
    return Path.buildPath(this.recipes() + '/:clientId', { clientId: recipeClientId })
  }

  dynamicRecipes() {
    return '/dynamic_recipes'
  }

  dynamicRecipe(dynamicRecipeClientId: string) {
    return Path.buildPath(this.dynamicRecipes() + '/:clientId', { clientId: dynamicRecipeClientId })
  }

  tags() {
    return '/tags'
  }

  flipperBase() {
    return AppConfig.API_URL + '/flipper'
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

  fileUploads() {
    return '/file_uploads'
  }

  fileUpload(fileUploadClientId: string) {
    return Path.buildPath(this.fileUploads() + '/:clientId', { clientId: fileUploadClientId })
  }

  currentAbility() {
    return '/ability'
  }

  shoppingLists() {
    return '/shopping_lists'
  }

  shoppingList(shoppingListClientId: string) {
    return Path.buildPath(this.shoppingLists() + '/:clientId', { clientId: shoppingListClientId })
  }
}

class AuthPath extends Path {
  base(): string {
    return AppConfig.API_URL + '/auth'
  }

  signin(): string {
    return '/login'
  }

  signout(): string {
    return '/logout'
  }

  signup(): string {
    return '/create-account'
  }
}

const appPath = new AppPath()
const apiPath = new ApiPath()
const authPath = new AuthPath()

export { apiPath as ApiPath, appPath as AppPath, authPath as AuthPath }

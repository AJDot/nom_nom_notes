import router from '~/router/index'
import { App } from 'vue'
import { NavigationFailure, RouteLocationNormalizedLoaded, RouteLocationRaw } from 'vue-router'
import { RouteName } from '~/router/routeName'
import { ApiPath } from '~/router/path'

export class RouterExtension {
  install(app: App): void {
    app.config.globalProperties.$routerExtension = this
  }

  names: typeof RouteName = RouteName

  replace(to: RouteLocationRaw): Promise<NavigationFailure | void | undefined> {
    const originalRequest = router.currentRoute.value.params.originalRequest
    let routeLocation: RouteLocationRaw
    if (typeof originalRequest === 'string') {
      routeLocation = { path: originalRequest }
    } else {
      routeLocation = to
    }

    return router.replace(routeLocation)
  }

  get ApiPath(): typeof ApiPath {
    return ApiPath
  }

  apiPath(path: string): string {
    return this.ApiPath.base() + path
  }

  get currentRoute(): RouteLocationNormalizedLoaded {
    return router.currentRoute.value
  }

  currentRouteIs(name: RouteName): boolean {
    return router.currentRoute.value.name === name
  }
}

const routerExtension = new RouterExtension()
export default routerExtension

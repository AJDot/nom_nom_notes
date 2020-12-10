import router from '~/router/index'
import { App } from 'vue'
import { NavigationFailure, RouteLocationRaw } from 'vue-router'
import { RouteName } from '~/router/routeName'

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
}

const routerExtension = new RouterExtension()
export default routerExtension

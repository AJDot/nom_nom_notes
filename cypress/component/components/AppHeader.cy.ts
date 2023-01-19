import AppHeader from '@/app-header.vue'
import { createStore } from 'vuex'
import { SessionGetterTypes } from '../../../src/store/modules/sessions/getters'
import { FeatureActionTypes } from '../../../src/store/modules/features/actions'

describe('<AppHeader />', () => {
  it('shows the app name', () => {
    const store = createStore({
      modules: {
        sessions: {
          namespaced: true,
          getters: {
            [SessionGetterTypes.SIGNED_IN]() {
              return false
            }
          }
        },
        features: {
          namespaced: true,
          actions: {
            [FeatureActionTypes.FETCH]() {
              return {}
            }
          }
        },
        users: {
          namespaced: true,
          state: {
            current: null,
          }
        }
      }
    })

    const $route = {

    }

    const $router = {
      currentRoute: { value: { path: '/' } }
    }

    const $routerExtension = {
      names: {},
      currentRouteIs() { return false }
    }

    const $flipper = {
      isEnabled() { return false }
    }

    cy.mount(AppHeader, {
      shallow: true,
      global: {
        plugins: [store],
        mocks: {
          $route,
          $router,
          $routerExtension,
          $flipper,
        },
        stubs: {
          RouterLink: true,
          RouterView: true,
        }
      },
    })
    cy.contains('h1', 'Nom Nom Notes').should('exist')
  })
})
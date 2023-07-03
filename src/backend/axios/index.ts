import axios from 'axios'
import AppConfig from '~/appConfig'
import { ApiPath, AppPath } from '~/router/path'
import { store, StoreModulePath } from '~/store'
import { SessionMutationTypes } from '~/store/modules/sessions/mutations'
import { HttpStatusCode } from '~/utils/httpUtils'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as qs from 'qs'

/**
 * DO NOT use store to get csrf - go straight to localStorage
 * If csrf is removed manually from localstorage (instead of through Vue app), this will still get the updated value
 */

const securedAxiosInstance = axios.create({
  baseURL: AppConfig.API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

const plainAxiosInstance = axios.create({
  baseURL: AppConfig.API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

securedAxiosInstance.interceptors.request.use((config) => {
  const method = config?.method?.toUpperCase()
  if (method !== 'OPTIONS' && method !== 'GET') {
    config.headers = {
      ...config.headers,
      'X-CSRF-TOKEN': localStorage.csrf,
    }
  }
  // Format nested params correctly
  config.paramsSerializer = params => {
    // Qs is already included in the Axios package
    return qs.stringify(params, {
      arrayFormat: 'brackets',
      encode: false,
    })
  }
  return config
})

securedAxiosInstance.interceptors.response.use(undefined, (error) => {
  if (
    error.response &&
    error.response.config &&
    error.response.status === HttpStatusCode.Unauthorized
  ) {
    // If 401 by expired access cookie, we do a refresh request
    return plainAxiosInstance
      .post(
        ApiPath.refresh(),
        {},
        { headers: { 'X-CSRF-TOKEN': localStorage.csrf } },
      )
      .then((response) => {
        store.commit(
          StoreModulePath.Session + SessionMutationTypes.SIGN_IN,
          response.data.csrf,
        )
        // After another successful refresh - repeat original request
        const retryConfig = error.response.config
        retryConfig.headers['X-CSRF-TOKEN'] = localStorage.csrf
        return plainAxiosInstance.request(retryConfig)
      })
      .catch((error) => {
        store.commit(
          StoreModulePath.Session + SessionMutationTypes.SIGN_OUT,
        )
        if (error.response.config.url.endsWith('refresh')) {
          return Promise.reject(error)
        } else {
          // redirect to signin if refresh fails
          location.replace(AppPath.base() + AppPath.signin())
        }
      })
  } else {
    return Promise.reject(error)
  }
})

export { securedAxiosInstance, plainAxiosInstance }

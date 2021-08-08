// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const configureEnvVars = (config) => {
  config.baseUrl = process.env.VUE_APP_URL
  config.env.api_url = process.env.VUE_APP_API_URL
  return config
}

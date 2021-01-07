export default class AppConfig {
  static API_URL = process.env.NODE_ENV === 'test' ? 'http://localhost:3001' : 'http://localhost:3000'
  static ROOT_PATH = '/'
}
